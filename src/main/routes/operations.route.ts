import { Router, Express } from 'express'
import { adaptRoute } from '../adapters/route.adapter'
import {
  makeAddOperationController,
  makeGetOperationController,
  makeGetOperationsController,
  makeUpdateOperationController,
  makeRemoveOperationController,
} from '../factories/controllers/operations'
import { protectedRoute } from '../middlewares/protected-route'

export const operationsRoutes = (app: Express): void => {
  const router = Router()
  app.use('/operation', router)

  router.use(protectedRoute)
  router.get('/operations', adaptRoute(makeGetOperationsController()))
  router.post('/operations', adaptRoute(makeAddOperationController()))
  router.put('/operations/:id', adaptRoute(makeUpdateOperationController()))
  router.get('/operations/:id', adaptRoute(makeGetOperationController()))
  router.delete('/operations/:id', adaptRoute(makeRemoveOperationController()))
}
