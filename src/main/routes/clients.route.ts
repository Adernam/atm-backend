import { adaptRoute } from '@/main/adapters/route.adapter'
import { Router, Express } from 'express'
import {
  makeSignUpController,
  makeUpdateClientController,
  makeGetClientController,
  makeGetClientsController,
  makeSigninController,
  makeRemoveClientController,
} from '../factories/controllers/clients'
import { protectedRoute } from '../middlewares/protected-route'

export const clientsRoutes = (app: Express): void => {
  const router = Router()
  app.use('/client', router)

  router.post('/signin', adaptRoute(makeSigninController()))
  router.post('/signup', adaptRoute(makeSignUpController()))

  router.use(protectedRoute)
  // router.post('/:id', adaptRoute(makeUpdateClientController()))
  router.get('/clients', adaptRoute(makeGetClientsController()))
  router.put('/clients/:id', adaptRoute(makeUpdateClientController()))
  router.get('/clients/:id', adaptRoute(makeGetClientController()))
  router.delete('/clients/:id', adaptRoute(makeRemoveClientController()))
}
