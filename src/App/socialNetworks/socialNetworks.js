// import youtube from 'passport-youtube-v3'
// import youtube from 'passport-youtube-v3'
import passport from 'passport';
import Vkontakte from 'passport-vkontakte';
import fetch from 'isomorphic-fetch';

const fields = [
  'photo_id',
  'verified',
  'sex',
  'bdate',
  'city',
  'country',
  'home_town',
  'has_photo',
  'photo_50',
  'photo_100',
  'photo_200_orig',
  'photo_200',
  'photo_400_orig',
  'photo_max',
  'photo_max_orig',
  'online',
  'domain',
  'has_mobile',
  'contacts',
  'site',
  'education',
  'universities',
  'schools',
  'status',
  'last_seen',
  'followers_count',
  'common_count',
  'occupation',
  'nickname',
  'relatives',
  'relation',
  'personal',
  'connections',
  'exports',
  'wall_comments',
  'activities',
  'interests',
  'music',
  'movies',
  'tv',
  'books',
  'games',
  'about',
  'quotes',
  'can_post',
  'can_see_all_posts',
  'can_see_audio',
  'can_write_private_message',
  'can_send_friend_request',
  'is_favorite',
  'is_hidden_from_feed',
  'timezone',
  'screen_name',
  'maiden_name',
  'crop_photo',
  'is_friend',
  'friend_status',
  'career',
  'military',
  'blacklisted',
  'blacklisted_by_me',
];

export default (ctx) => {
  const { Passport } = ctx.models;
  const socialNetworks = {};
  socialNetworks.passport = passport;
  socialNetworks.strategy = {};
  socialNetworks.strategy.Vkontakte = Vkontakte.Strategy;
  socialNetworks.passport.use(new socialNetworks.strategy.Vkontakte({
    clientID: '5717694',
    clientSecret: 'o1quBEHhCa8OwCKdmdH5',
    callbackURL: 'http://localhost:3000/api/v1/auth/vkontakte/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    const res = await fetch(`https://api.vk.com/method/users.get?fields=${fields.join(',')}&access_token=${accessToken}`);
    const json = await res.json();
    profile.data = json.response[0];
    let p = await Passport.findOne({
      provider: 'vkontakte',
      providerId: profile.id,
    });
    if (p) {
      return done(null,
        { accessToken, refreshToken, profile, passport: p });
    }
    p = new Passport({
      provider: 'vkontakte',
      providerId: profile.id,
      raw: profile.data,
      token: accessToken,
      profile: {
        firstName: profile.data.first_name,
        lastName: profile.data.last_name,
        gender: profile.data.sex === 1 ? 'female' : 'male',
        photos: [
          profile.data.photo_50,
          profile.data.photo_100,
          profile.data.photo_200,
          profile.data.photo_max,
        ],
        avatar: profile.data.photo_max_orig,
        city: profile.data.city,
        country: profile.data.country,
      },
    });
    await p.save();
    return done(null,
      { accessToken, refreshToken, profile, passport: p });
  }));
  return socialNetworks;
};
