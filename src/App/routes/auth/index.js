import AuthPage from './AuthPage';
import getPassportService from '../../services/PassportService';

const getParams = function () {
  const str = window.location.search;
  const objURL = {};

  str.replace(
       new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
       ($0, $1, $2, $3) => {
         objURL[$1] = $3;
       },
   );
  return objURL;
};

export default {
  children: [
    {
      path: '/(login|)',
      action({ appStore }) {
        console.log('appStore', appStore.auth);
        return {
          title: 'Cabinet',
          component: <AuthPage type="login" />,
        };
      },
    },
    {
      path: '/recovery',
      action() {
        return {
          title: 'recovery',
          component: <AuthPage type="recovery" />,
        };
      },
    },
    {
      path: '/signup',
      action() {
        return {
          title: 'signup',
          component: <AuthPage type="signup" />,
        };
      },
    },
    {
      path: '/vkontakte',
      async action({ appStore }) {
        if (__SERVER__) {
          return {
            title: '',
            component: <div>Loading</div>,
          };
        }
        if (!__SERVER__) {
          const { p } = getParams();
          if (!p) {
            return {
              redirect: '/auth/login',
            };
          }
          const passport = await appStore.api.getPassportByToken(p)
          console.log({ passport });
          if (passport.user) {
            console.log({ passport });
            await appStore.auth.loginSocial({ p, provider: passport.provider });
            if (appStore.auth.isAuth) {
              return { redirect: '/' };
            }
          }
          return {
            title: 'vkontakte',
            component: <AuthPage type="vkontakte" passport={passport} token={p} />,
          };
        }
      },
    },
    {
      path: '/logout',
      async action({ appStore }) {
        if (__SERVER__) {
          return {
            component: <div>Loading</div>,
          };
        }
        await appStore.auth.logout();
        //  console.log('appStore', appStore);
        return { redirect: '/' };
       //  return {
       //    title: 'signup',
       //    component: <AuthPage type="signup" />,
       //  };
      },
    },
   //  {
   //    path: '/profile',
   //    action() {
   //     //  return {
   //     //    title: 'signup',
   //     //    component: <AuthPage type="signup" />,
   //     //  };
   //    },
   //  },
  ],
};
