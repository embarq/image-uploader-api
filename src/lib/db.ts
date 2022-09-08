import assert from 'assert'
import { Sequelize } from 'sequelize'

assert(process.env.DATABASE_URL)

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
    }
  },
})

export const init = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    await sequelize.sync()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

export const close = () => sequelize.close()
