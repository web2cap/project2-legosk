import UniversalSchema from 'lego-starter-kit/utils/UniversalSchema';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
export function getSchema(ctx) {
  const mongoose = ctx.db;
  const schema = new UniversalSchema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Сырые данные которые пришли из соц сети
    raw: {
      type: Object,
      default: {},
    },
    provider: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    // Дата последнего обновления данных
    fetchedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: Boolean,
      default: true,
    },
    profile: {
      type: Object,
      default: {},
    },
  }, {
    timestamps: true,
  });

  schema.methods.getUser = async function () {
    return ctx.models.User.findById(this.user);
  };

  schema.methods.getIdentity = function (params = {}) {
    const object = _.pick(this.toObject(), ['_id']);
    return Object.assign(object, params);
  };

  schema.methods.generateToken = function (params) {
    return jwt.sign(this.getIdentity(params), ctx.config.jwt.secret);
  };
  schema.statics.decodeToken = function (token) {
    return jwt.verify(token, ctx.config.jwt.secret);
  };
  schema.statics.getByToken = async function (token) {
    const { _id } = this.decodeToken(token);
    return this.findById(_id);
  };

  return schema;
}

export default(ctx) => {
  return ctx.db.model('Passport', getSchema(ctx).getMongooseSchema(), 'passports');
};
