import getAuth from './Auth';
import getUser from './User';
import getPassportApi from './passport/passport.api';

export default (ctx, params) => {
  const { Passport, User } = ctx.models;
  const { e400, e404 } = ctx.errors;
  const api = ctx.asyncRouter();
  api.use('/passport', getPassportApi(ctx));
  api.use('/auth', getAuth(ctx, params));
  api.use('/user', getUser(ctx, params));

  api.get('/user', async (req) => {
    return User.findById(req.user._id);
  });
  api.all('/auth/vkontakte/signup', async (req) => {
    const passport = await Passport.getByToken(req.data.p);
    if (!passport) {
      return e404('!passport');
    }
    if (passport.user) {
      return e400('passport already have user');
    }
    const params = Object.assign(passport.profile, req.data);
    const user = new User(params);
    await user.save();
    passport.user = user._id;
    await passport.save();
    user.passports.push(passport._id);
    await user.save();
    return {
      user,
      token: user.generateAuthToken(),
    };
  });
  api.all('/auth/vkontakte/login', async (req) => {
    const passport = await Passport.getByToken(req.data.p);
    const user = await passport.getUser();
    if (!user) {
      return e404('User is not founded');
    }
    return {
      user,
      token: user.generateAuthToken(),
    };
  });
  api.get('/auth/youtube', ctx.passport.authenticate('youtube'));
  api.get('/auth/vkontakte', ctx.passport.authenticate('vkontakte',
    { scope: ctx.config.auth.socials.vkontakte.scope },
  ));
  api.get('/auth/:provider/callback', async (req, res) => {
    const params = req.allParams();
    try {
      return new Promise((resolve) => {
        return (ctx.passport.authenticate(params.provider, {}, (err, data) => {
          if (err) {
            return resolve({ err })
          }
          if (data.passport) {
            const { passport } = data
            return resolve(res.redirect(`${ctx.config.protocol}://${ctx.config.host}:${ctx.config.externalPort}/auth/${params.provider}?p=${passport.generateToken()}`));
          }
        }))(req);
      });
    } catch (err) {
      console.error(err, 'ERROR!');
    }
    // try {
    //   return new Promise((resolve) => {
    //     (ctx.passport.authenticate(params.provider, {}, (err, {
    //       passport,
    //     }) => {
    //       return resolve(res.redirect(`${ctx.config.protocol}://${ctx.config.host}:${ctx.config.externalPort}/auth/${params.provider}?p=${passport.generateToken()}`));
    //     }))(req);
    //   });
    // } catch (err) {
    //   return { err };
    // }
  });

  api.all('*', () => {
    return 'Example API working';
  });

  return api;
};
