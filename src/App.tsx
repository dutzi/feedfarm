import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
import cx from 'classnames';
import styles from './App.module.scss';
import Main from './pages/Main';
import { Switch, Route, useLocation, useParams } from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
// import EditProfile from './pages/EditProfile';
import Header from './components/Header';
import Navbar from './components/Navbar';
import MyProfile from './pages/MyProfile';
import Messages from './pages/Messages';
import Feed from './pages/Feed';
import Notifications from './pages/Notifications';
import useCurrentUserFromFirebase from './hooks/use-current-user-from-firebase';
import { useTypedSelector } from './state/reducer';
import PhotoGallery from './components/PhotoGallery';
import PageFallbackSpinner from './components/PageFallbackSpinner';
import Footer from './components/Footer';
import useIsCurrentUserAdmin from './hooks/use-is-current-user-admin';
import useDetectAdBlock from './hooks/use-detect-ad-block';
import Referral from './pages/Referral';
import useCurrentLanguage from './hooks/use-current-language';
import { Stripes } from './animations';
import SignupModal from './components/SignupModal';
import CookiePopover from './components/CookiePopover';
import useReferrerDetection from './hooks/use-referrer-detection';
import gsap from 'gsap';
// import AvatarWall from './components/AvatarWall';
import { useTypedDispatch } from './state/reducer';
import PriorityFeedbackModal from './components/PriorityFeedbackModal';
import MyFeeds from './pages/MyFeeds';
import CreateFeed from './pages/CreateFeed';

(window as any).gsap = gsap;

const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));

const AdminTools =
  process.env.NODE_ENV === 'development'
    ? lazy(() =>
        import(/* webpackChunkName: "admin-tools." */ './pages/AdminTools'),
      )
    : lazy(() => import('./components/PageFallbackSpinner'));

function Home({ isLoggedIn }: { isLoggedIn: boolean }) {
  const params = useParams<{ referreeId?: string }>();

  if (params.referreeId) {
    window.localStorage.setItem('referreeId', params.referreeId);
  }

  return <Main />;
}

const pathsWithEndlessScroll = ['/'];

function App() {
  const [isLoadingCurrentUser, setIsLoadingCurrentUser] = useState(true);
  const profileUid = useTypedSelector(state => state.ui.profileUid);
  const gallery = useTypedSelector(state => state.ui.gallery);
  const showSignupModal = useTypedSelector(state => state.ui.showSignupModal);
  const dispatch = useTypedDispatch();
  // const isSFWMode = useIsSFWMode();
  const isCurrentUserAdmin = useIsCurrentUserAdmin();
  const impersotedUser = useTypedSelector(
    state => state.currentUser.impersonatedUser,
  );
  const [currentUser] = useCurrentUserFromFirebase();
  const { language, isRtl, initCurrentLanguage } = useCurrentLanguage();
  const location = useLocation();
  // const history = useHistory();
  useDetectAdBlock();
  useReferrerDetection();
  // useUUID();
  const stripes = useRef<any>(null);

  useEffect(() => {
    if ((window as any).Intercom) {
      (window as any).Intercom('shutdown');
    }
  }, []);

  useEffect(() => {
    if (language === 'he') {
      if ((window as any).Intercom) {
        (window as any).Intercom('boot', (window as any).intercomSettings);
      }
    }
  }, [language]);

  useEffect(() => {
    document.body.style.direction = isRtl ? 'rtl' : 'ltr';
  }, [isRtl, language]);

  useEffect(() => {
    if (currentUser) {
      initCurrentLanguage();
    }
  }, [currentUser]);

  useEffect(() => {
    document.querySelector('html')!.style.transition = 'all 0.4s ease-out';
  }, []);

  useEffect(() => {
    if (currentUser) {
      dispatch({
        type: 'set-current-user',
        payload: { currentUser },
      });
      setIsLoadingCurrentUser(false);
      // redirectToOnboarding();
    } else if (currentUser === null) {
      setIsLoadingCurrentUser(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (isCurrentUserAdmin) {
      impersonateCurrentUser();
    }
  }, [isCurrentUserAdmin]);

  // useEffect(() => {
  //   setSFWMode(isSFWMode ? 'sfw' : 'nsfw');
  // }, [isSFWMode]);

  useEffect(() => {
    if (stripes.current) {
      stripes.current.run();
    }
  }, [stripes]);

  // if (!(window as any).hasLoggedTime) {
  //   console.log(new Date().getTime() - (window as any).htmlLoadTime);
  // }

  // if (isLoadingCurrentUser) {
  //   return <AvatarWall />;
  // }
  // } else if (
  //   !currentUser &&
  //   pathsAllowedForGuests.indexOf(location.pathname) === -1 &&
  //   !location.pathname.match(/\/r\/.*/)
  // ) {
  //   // history.push('/');

  // if (!(window as any).hasLoggedTime) {
  //   console.log(new Date().getTime() - (window as any).htmlLoadTime);
  //   (window as any).hasLoggedTime = true;
  // }

  function impersonateCurrentUser() {
    // dispatch({ type: 'impersonate', payload: { user: currentUser } });
  }

  const uid = currentUser ? currentUser.id : '';
  const isLoggedIn = !!uid;

  const showFooter = !location.pathname.startsWith('/f/');

  return (
    <div className={cx(styles.container, isRtl && 'rtl')}>
      {/* <ColorsMatcher /> */}
      <Stripes ref={stripes} />
      <Header />
      <Navbar />
      <div className={styles.content}>
        <Switch>
          <Route path="/" exact>
            <Home isLoggedIn={isLoggedIn} />
          </Route>
          <Route path="/r/:referreeId" exact>
            <Home isLoggedIn={isLoggedIn} />
          </Route>
          <Route path="/f/:feedName" exact>
            <Feed />
          </Route>
          <Route path="/my-feeds">
            <MyFeeds />
          </Route>
          <Route path="/create-feed">
            <CreateFeed />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/signin">
            <Signin />
          </Route>
          <Route path="/edit-profile">
            <MyProfile uid={uid} />
          </Route>
          <Route path="/messages">
            <Messages uid={uid} />
          </Route>
          <Route path="/notifications">
            <Notifications />
          </Route>
          <Route path="/terms-and-conditions">
            <Suspense fallback={<PageFallbackSpinner />}>
              <TermsAndConditions />
            </Suspense>
          </Route>
          <Route path="/cookie-policy">
            <Suspense fallback={<PageFallbackSpinner />}>
              <CookiePolicy />
            </Suspense>
          </Route>
          <Route path="/referral">
            <Referral />
          </Route>
        </Switch>

        <SignupModal show={!!showSignupModal} />
        <PriorityFeedbackModal />
        {gallery && gallery.isOpen && <PhotoGallery />}
        {impersotedUser && impersotedUser.id !== uid && (
          <div className={styles.redBox}>
            <button
              className={styles.timesButton}
              onClick={impersonateCurrentUser}
            >
              <i className="fa fa-times" />
            </button>
          </div>
        )}
      </div>
      <div className={styles.flex1}></div>
      {showFooter && <Footer />}
      <CookiePopover />
    </div>
  );
}

export default App;
// Map redux state to component props
