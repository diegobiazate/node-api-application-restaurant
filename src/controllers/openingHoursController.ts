import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from "uuid";
import { OpeningHours, OpeningHoursInterface } from '../models/OpeningHours';
import { Restaurant } from "../models/Restaurant";

export const listAll = async (req: Request, res: Response) => {
  const openingHours = await OpeningHours.findAndCountAll();
  res.json({total: openingHours.count, dados: openingHours.rows})
}

export const findByIdRestaurant = async (req: Request, res: Response) => {
  const {id_restaurant} = req.query; // recebe o id do restaurante enviado na requisição
  if(id_restaurant){ //confere se existe
    //busca no banco todos os registros de horário da empresa
    const openingHours = await OpeningHours.findAll({
      where: {
        id_restaurant
      }
    })

    if(openingHours.length > 0){ //confere se houve algum retorno
      res.json({openingHours}) //se houve, retorna o mesmo
    }else {
      // caso não tenha localizado nenhum registro, retorna o status 204, 
      // informando que a requisição foi feita, porém não encontrou nenhum dado
      res.status(204).json({success: false, message: 'Restaurante não localizado!'})
    }
  }else{
    res.status(400).json({success: false, message: 'ID Restaurante não enviado!'})
  }
}

export const createOpeningHours = async (req: Request, res: Response) => {
  const { id_restaurant, weekday, opening_time, closing_time } = req.body; //recebe os dados enviados na requisição

  // verifica se todos os dados foram enviados
  if(id_restaurant && weekday && opening_time && closing_time){
    let restaurant = await Restaurant.findByPk(id_restaurant); // verifica se o id_restaurant existe na tabela de Restaurantes
    if(restaurant){ // se existir, continua com o processo de validação/criação
      if(weekday >= 1 && weekday <= 7){ // confere se o dia da semana informado, está dentro do permitido (de 1 a 7)
        try {
          const id = uuidv4(); // geração de uuid
          // busca no banco de dados, e existe algum registro de horário para a empresa e pelo dia
          const openingHours = await OpeningHours.findAll({
            where: {
              id_restaurant, weekday
            }
          })
          if(openingHours.length > 0){ //verifica se houve algum retorno
            let alreadyExists = false;
            //percorre o retorno do banco, e confere se naquele dia em expecífico já existe o mesmo horário de abertura ou fechamento informado.
            openingHours.forEach(item => {
              if(item.opening_time == opening_time || item.closing_time == closing_time){
                return alreadyExists = true
              }
            });
            // se existir, retorna um erro, com mensagem informativa
            if(alreadyExists){
              res.status(400).json({success: false, message: 'Horário de funcionamento e dia já registrados!'})
            }else {
              //caso não exista, realiza a criação
              await OpeningHours.create({
                id, id_restaurant, weekday, opening_time, closing_time
              })
              //retorna o status 201, informando que foi criado o novo registro e mensagem informativa.
              res.status(201).json({success: true, message: 'Horário de funcionamento registrado com sucesso!'})
            }
          }else {
            //caso não encontre registro no banco, realiza a criação
            await OpeningHours.create({
              id, id_restaurant, weekday, opening_time, closing_time
            })
            //retorna o status 201, informando que foi criado o novo registro e mensagem informativa.
            res.status(201).json({success: true, message: 'Horário de funcionamento registrado com sucesso!'})
          }
        } catch (error) {
          //caso ocorra algum erro, retorna o mesmo.
          res.status(400).json({ Error: error})
        }
      }else {
        // caso weekday não esteja entre 1 e 7, retorna status de erro, e mensagem informativa.
        res.status(400).json({success: false, message: 'Dia da semana inválido!'})
      }
    }else {
      // caso não encontre nenhum restaurante com o id informado, retorna status de erro, e mensagem informativa.
      res.status(400).json({success: false, message: 'Restaurante não localizado!'})
    }
  }else {
    // caso não seja enviado todos os dados, retorna status de erro, e mensagem informativa.
    res.status(400).json({success: false, message: 'Não foi possível realizar o cadastro, pois está faltando dados!'})
  }
}

export const editOpeningHours = async (req: Request, res: Response) => {
  const {id, id_restaurant, weekday, opening_time, closing_time} = req.body;

  if(id && id_restaurant && weekday && opening_time && closing_time){
    if(weekday >= 1 && weekday <= 7){
      const openingHours = await OpeningHours.findOne({
        where: {
          id, id_restaurant
        }
      })
      if(openingHours) {
        openingHours.weekday = weekday;
        openingHours.opening_time = opening_time;
        openingHours.closing_time = closing_time;

        await openingHours.save();
        res.status(200).json({success: true, message: 'Horário alterado com sucesso!'})
      }else{
        // caso não encontre o horário, pelo id informado, retorna status de erro, e mensagem informativa
        res.status(400).json({success: false, message: 'Registro não localizado!'})
      }
    }else{
      // caso weekday não esteja entre 1 e 7, retorna status de erro, e mensagem informativa.
      res.status(400).json({success: false, message: 'Dia da semana inválido!'})
    }
  }else{
    // caso não seja enviado todos os dados, retorna status de erro, e mensagem informativa.
    res.status(400).json({success: false, message: 'Não foi possível editar o cadastro, pois está faltando dados!'})
  }
}

export const deleteOpeningHours = async (req: Request, res: Response) => {
  const {id} = req.query;

  if(id){
    try {
      let openingHours = await OpeningHours.findByPk(id.toString());
      if(openingHours){
        await openingHours.destroy();

        res.status(200).json({success: true, message: 'Registro deletado com sucesso!'});
      }else {
        res.status(400).json({ success: false, message: 'Registro não encontrado!'})
      }
    } catch (error) {
      res.status(400).json({ Error: error})
    }
  }else {
    res.status(400).json({ success: false, message: 'Favor informar o id do registro que deseja excluir!'})
  }
}

interface ResponseIsOpen {
  id_restaurant: string;
  isOpen: boolean;
}

export const isOpen = async (req: Request, res: Response) => {
  const { date_time, id_restaurant } = req.query;
  if(date_time){
    let date = date_time.toString();
    
    if(date.includes('/')){
      res.status(400).json({success: false, message: 'Formato de data inválido. Formato: YYYY-MM-DD HH:00'})
    }else{
      const dataTime = new Date(date);

      let weekday = dataTime.getDay();
      let hours = dataTime.getHours();
      let minutes = dataTime.getMinutes();
      let data: ResponseIsOpen[] = [];
      
      //console.log(minutes)

      if(id_restaurant){
        const openingHours = await OpeningHours.findAll({
          where:{
            id_restaurant, 
            weekday
          }
        });
        openingHours.forEach(item => {
          if(item.weekday == weekday){
            let openHourItem = item.opening_time.split(":");
            let closeHourItem = item.closing_time.split(":");
            //console.log(parseInt(closeHourItem[1]))
            if((hours >= parseInt(openHourItem[0]) && hours <= parseInt(closeHourItem[0])) && 
            (minutes >= parseInt(openHourItem[1]) && minutes <= parseInt(closeHourItem[1]))){
              data = [{
                id_restaurant: item.id_restaurant,
                isOpen: true
              }]
            }else{
              if(data.length > 0){
                data.forEach(i => {
                  if(id_restaurant !== i.id_restaurant){
                    data = [{
                      id_restaurant: item.id_restaurant,
                      isOpen: false
                    }]
                  }
                })
              }else{
                data = [{
                  id_restaurant: item.id_restaurant,
                  isOpen: false
                }]
              }
            }
          }
        })
      }else {
        const openingHours = await OpeningHours.findAll({
          where:{ 
            weekday
          }
        });

        openingHours.forEach(item => {
          if(item.weekday == weekday){
            let openHourItem = item.opening_time.split(":");
            let closeHourItem = item.closing_time.split(":");
            if((hours >= parseInt(openHourItem[0]) && hours <= parseInt(closeHourItem[0])) && 
            (minutes >= parseInt(openHourItem[1]) && minutes <= parseInt(closeHourItem[1]))){
              if(data.find(e => e.id_restaurant === item.id_restaurant && e.isOpen === false)){
                data.map(element => {
                  if(element.id_restaurant === item.id_restaurant && element.isOpen === false){
                    element.isOpen = true
                  }
                })
              }else{
                data.push({
                  id_restaurant: item.id_restaurant,
                  isOpen: true
                })
              }
            }else{
              if(data.find(e => e.id_restaurant === item.id_restaurant)){
                data.map(element => {
                  if(element.id_restaurant === item.id_restaurant && element.isOpen === true){
                    return
                  }
                  if(element.id_restaurant === item.id_restaurant && element.isOpen === false){
                    return
                  }
                })
              }else{
                data.push({
                  id_restaurant: item.id_restaurant,
                  isOpen: false
                })
              }
            }
          }
        })
        
      }
      res.json({ data });
    }
  }else{
    const dataTime = new Date();
    
    let weekday = dataTime.getDay();
    let hours = dataTime.getHours();
    let minutes = dataTime.getMinutes();
    let data = [];

    if(id_restaurant){
      const openingHours = await OpeningHours.findAll({
        where:{
          id_restaurant, 
          weekday
        }
      });
      openingHours.forEach(item => {
        if(item.weekday == weekday){
          let openHourItem = item.opening_time.split(":");
          let closeHourItem = item.closing_time.split(":");
          if((hours >= parseInt(openHourItem[0]) && hours <= parseInt(closeHourItem[0])) && 
          (minutes >= parseInt(openHourItem[1]) && minutes <= parseInt(closeHourItem[1]))){
            data = [{
              id_restaurant: item.id_restaurant,
              isOpen: true
            }]
          }else{
            if(data.length > 0){
              data.forEach(i => {
                if(id_restaurant !== i.id_restaurant){
                  data = [{
                    id_restaurant: item.id_restaurant,
                    isOpen: false
                  }]
                }
              })
            }else{
              data = [{
                id_restaurant: item.id_restaurant,
                isOpen: false
              }]
            }
          }
        }
      })
    }else {
      const openingHours = await OpeningHours.findAll({
        where:{ 
          weekday
        }
      });
      openingHours.forEach(item => {
        if(item.weekday == weekday){
          let openHourItem = item.opening_time.split(":");
          let closeHourItem = item.closing_time.split(":");
          if((hours >= parseInt(openHourItem[0]) && hours <= parseInt(closeHourItem[0])) && 
            (minutes >= parseInt(openHourItem[1]) && minutes <= parseInt(closeHourItem[1]))){
            if(data.find(e => e.id_restaurant === item.id_restaurant && e.isOpen === false)){
              data.map(element => {
                if(element.id_restaurant === item.id_restaurant && element.isOpen === false){
                  element.isOpen = true
                }
              })
            }else{
              data.push({
                id_restaurant: item.id_restaurant,
                isOpen: true
              })
            }
          }else{
            if(data.find(e => e.id_restaurant === item.id_restaurant)){
              data.map(element => {
                if(element.id_restaurant === item.id_restaurant && element.isOpen === true){
                  return
                }
                if(element.id_restaurant === item.id_restaurant && element.isOpen === false){
                  return
                }
              })
            }else{
              data.push({
                id_restaurant: item.id_restaurant,
                isOpen: false
              })
            }
          }
        }
      })
    }
    res.json({ data });
  }
}
