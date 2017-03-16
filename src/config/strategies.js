import fetch from 'isomorphic-fetch';
export default (config) => {
  return {
    vkontakte: {
      config: {
        clientID: '5717694',
        clientSecret: 'o1quBEHhCa8OwCKdmdH5',
        // callbackURL: `${url}/api/v1/auth/vkontakte/callback`,
      },
      scope: ['asdasdasd'],
      // fields: [
      //   'sex',
      //   'bdate',
      //   'city',
      //   'country',
      //   'photo_50',
      //   'photo_100',
      //   'photo_200',
      //   'photo_max_orig',
      //   'photo_max_orig',
      // ],
    },
  };
};
