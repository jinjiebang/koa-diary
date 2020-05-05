const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../../core/db')
const { User } = require('../models/user')
const { Favor } = require('../models/favor')
const { formatDate } = require('../lib/helper')

class Diary extends Model {
    static async getUserDiary(uid, start = 0, count = 10) {
        await User.validatorUser(uid)
        const favors = await Favor.findAll({
            where: {
                uid
            }
        })
        const favorDiaryIds = favors.map(f => {
            return f.diary_id
        })
        await User.validatorUser(uid)
        const diary = await Diary.findAll({
            order: [['id', 'DESC']],
            where: {
                uid: uid
            },
            offset: parseInt(start),
            limit: parseInt(count)
        })
        diary.forEach(item => {
            item.dataValues.create_time = formatDate(item.dataValues.create_time)
            if (favorDiaryIds.includes(item.id)) {
                item.dataValues.isFavor = 1
            } else {
                item.dataValues.isFavor = 0
            }
        })
        return diary
    }

    static async getAllDiary(start, count, id) {
        await User.validatorUser(id)
        const favors = await Favor.findAll({
            where: {
                uid: id
            }
        })
        const favorDiaryIds = favors.map(f => {
            return f.diary_id
        })
        const diary = await Diary.findAll({
            order: [['id', 'DESC']],
            offset: parseInt(start),
            limit: parseInt(count)
        })
        diary.forEach(item => {
            item.dataValues.create_time = formatDate(item.dataValues.create_time)
            if (favorDiaryIds.includes(item.id)) {
                item.dataValues.isFavor = 1
            } else {
                item.dataValues.isFavor = 0
            }
        })
        return diary
    }
    static async updateDiary(uid, id, content) {
        await User.validatorUser(uid)
        const diary = await Diary.update(
            {
                content
            },
            {
                where: {
                    id
                }
            }
        )
        return diary
    }
    static async deleteDiary(uid, id) {
        await User.validatorUser(uid)
        return await sequelize.transaction(async t => {
            const diary = await Diary.destroy(
                {
                    force: true, // 硬删除
                    where: {
                        id
                    }
                },
                { transaction: t }
            )
            await Favor.destroy(
                {
                    force: true, // 硬删除
                    where: {
                        diary_id: id
                    }
                }
            )
            return diary
        })
    }
}

Diary.init(
    {
        uid: DataTypes.INTEGER,
        nickname: DataTypes.STRING,
        content: DataTypes.STRING(2000),
        create_time: DataTypes.DATE,
        favor_nums: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        look_nums: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    },
    {
        sequelize,
        tableName: 'diary'
    }
)

module.exports = {
    Diary
}