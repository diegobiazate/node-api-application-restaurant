import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from "uuid";
import { Restaurant } from "../models/Restaurant";

export const listAll = async (req: Request, res: Response) => {
  let restaurants = await Restaurant.findAndCountAll();
  res.json({ total: restaurants.count, data: restaurants.rows });
}

export const findByName = async (req: Request, res: Response) => {
  const {name} = req.query;

  if(name){
    const restaurant = await Restaurant.findAndCountAll({
      where: { 
        name: {
          [Op.like]: `%${name}%`
        }
     }
    });
    if(restaurant.count > 0){
      res.json({ total: restaurant.count, data: restaurant.rows });
    }else{
      res.status(204).json({success: false, message: 'Não foi possível localizar o cadastro!'})
    }
  }else{
    res.status(400).json({success: false, message: 'Favor enviar o nome do restaurante que deseja localizar!'})
  }
}

export const createNewRestaurant = async (req: Request, res: Response) => {
  const {name, document, type, address, city} = req.body;

  if(name && document && type && address && city){
    try {
      let hasRestaurant = await Restaurant.findOne({where: { name }});
      if(!hasRestaurant){
        const id = uuidv4();
        await Restaurant.create({
          id, name, document, type, address, city
        })

        res.status(201).json({success: true, message: 'Cadastro criado com sucesso!'})
      }else{
        res.status(400).json({success: false, message: 'Já existe um restaurante com este nome!'})
      }
    } catch (error) {
      res.status(400).json({ Error: error})
    }
  }else{
    res.status(400)
    .json({success: false, message: 'Não foi possível realizar o cadastro, pois não está sendo enviado todos os dados!'})
  }
}

export const updateRestaurant = async (req: Request, res: Response) => {
  const {id, name, document, type, address, city} = req.body;

  if(id && name && document && type && address && city){
    try {
      let restaurant = await Restaurant.findByPk(id);

      if(restaurant){
        restaurant.name = name;
        restaurant.document = document;
        restaurant.type = type;
        restaurant.address = address;
        restaurant.city = city;

        await restaurant.save();
        res.status(200).json({success: true, message: 'Dados alterados com sucesso!'});
      }
    } catch (error) {
      res.status(400).json({ Error: error})
    }
  }else {
    res.status(400).json({ success: false, message: 'Favor enviar todos os dados!'})
  }
}

export const deleteRestaurant = async (req: Request, res: Response) => {
  const {id} = req.query;

  if(id){
    try {
      let restaurant = await Restaurant.findByPk(id.toString());
      if(restaurant){
        await restaurant.destroy();

        res.status(200).json({success: true, message: 'Restaurante deletado com sucesso!'});
      }else {
        res.status(400).json({ success: false, message: 'Restaurante não encontrado!'})
      }
    } catch (error) {
      res.status(400).json({ Error: error})
    }
  }else {
    res.status(400).json({ success: false, message: 'Favor informar o id do restaurante que deseja excluir!'})
  }
}
