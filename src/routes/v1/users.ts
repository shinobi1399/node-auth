import * as ex from 'express';
import {userService} from '../../services/user-service';

let router = ex.Router();

export class UsersRouter {
  public configure(app: ex.Application) {
    router.post('/', async function (req, res, next) {
      try {
        let user = await userService.createUser(req.body);
        res.json(user);
      }
      catch (err) {
        next(err);
      }
    });

    router.get('/hi', async function (req, res, next) {
      res.send('hello from me 2');
    });

    app.use('/v1/users', router);
  }
}

export const usersRouter = new UsersRouter();
