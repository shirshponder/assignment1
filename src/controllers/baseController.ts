import { Request, Response } from 'express';
import status from 'http-status';
import { Model } from 'mongoose';

class BaseController<T> {
  model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  async getAll(req: Request, res: Response) {
    const queryFilters = req.query;
    try {
      const filters: Record<string, any> = {};
      for (const key in queryFilters) {
        if (queryFilters[key]) {
          filters[key] = queryFilters[key];
        }
      }

      const items = await this.model.find(filters);
      res.status(status.OK).send(items);
    } catch (error) {
      res.status(status.BAD_REQUEST).send(error);
    }
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const item = await this.model.findById(id);

      if (item) {
        res.status(status.OK).send(item);
      } else {
        res.status(status.NOT_FOUND).send('Item not found');
      }
    } catch (error) {
      res.status(status.BAD_REQUEST).send(error);
    }
  }

  async create(req: Request, res: Response) {
    const body = req.body;
    try {
      const item = await this.model.create(body);
      res.status(status.CREATED).send(item);
    } catch (error) {
      res.status(status.BAD_REQUEST).send(error);
    }
  }

  async deleteItem(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const deletedItem = await this.model.findByIdAndDelete(
        { _id: id },
        {
          returnDocument: 'after',
        },
      );

      if (deletedItem) {
        res.status(status.OK).send(deletedItem);
      } else {
        res.status(status.NOT_FOUND).send('Item not found');
      }
    } catch (error) {
      res.status(status.BAD_REQUEST).send(error);
    }
  }

  async updateItem(req: Request, res: Response) {
    const id = req.params.id;
    const body = req.body;

    try {
      const updatedItem = await this.model.findByIdAndUpdate(
        { _id: id },
        body,
        { returnDocument: 'after' },
      );
      if (updatedItem) {
        res.status(status.OK).send(updatedItem);
      } else {
        res.status(status.NOT_FOUND).send('Item not found');
      }
    } catch (error) {
      res.status(status.BAD_REQUEST).send(error);
    }
  }
}

export default BaseController;
