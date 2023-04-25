import 'module-alias/register'
import { app } from './main/app'
import { PostgresRepository } from './infra/postgres/config/data-souce'

app.listen(process.env.SERVER_PORT, () => {
  PostgresRepository.initialize()
    .then(() => {
      console.log(`App is running on port ${process.env.SERVER_PORT}`)
    })
    .catch((error) => console.log(error))
})
