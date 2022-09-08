import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../lib/db'

class ImageModel extends Model {
  declare id: number
  declare url: string
  declare name: string
  declare created_at: number
  declare updated_at: number
}

ImageModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'uploads_image',
    indexes: [
      {
        name: 'uploads_image_name_ix',
        unique: false,
        fields: ['name']
      }
    ],
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

export const create = async (payload: Pick<ImageModel, 'name' | 'url'>) => {
  const instance = await ImageModel.create(payload)
  const data = await instance.save()
  return data.get({ plain: true })
}

export const findOneByName = async (name: string) => {
  const instance = await ImageModel.findOne({
    where: {
      name
    }
  })

  return instance?.toJSON<ImageModel>()
}
