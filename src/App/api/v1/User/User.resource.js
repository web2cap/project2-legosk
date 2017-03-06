import getModules from '../v1.modules';

export default (ctx) => {
  const { User } = ctx.models;
  const modules = new getModules(ctx);
  const resource = {

    get: async (req) => {
      const criteria = modules.getCriteria(req);
      console.log(criteria, '45yr56khihjgiu45hui45hiu');
      const user = await User.findOne(criteria);
      console.log(user);
      return user;
    },

    edit: async (req) => {
      modules.isAuth(req);
      const userId = req.user._id;
      const params = req.allParams();
      const user = await User.findById(userId);
      console.log(user, params);
      Object.assign(user, params);
      return user.save();
    },

  };

  return resource;
};
