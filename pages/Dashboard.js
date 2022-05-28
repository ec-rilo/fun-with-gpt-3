import { useEffect, useState } from 'react';
import styled from 'styled-components';

// Assets
import { io } from "socket.io-client";

// Firebase
import { auth } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

// Components
import StyledContainer from '../components/Container';
import StyledLowerDash from '../components/LowerDash';
import StyledUpperDash from '../components/UpperDash';

function Dashboard({ className }) {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState('');
  const [cards, setCards] = useState([]);
  const [userName, setUserName] = useState('');


  // Loads user information
  useEffect(() => {
    if (user) {
      setUserName(user.displayName);

      setUserData({
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL
      });
    }
  }, [user]);

  // Loads cards on load.
  useEffect(() => {
    const socket = io();
    socket.once('allCardsDesc', (newCards) => {
      if (Array.isArray(newCards)) {
        console.log('asdf')
        setCards(newCards);
      }
    })
  }, [])

  return (
    <div className={className}>
      <StyledUpperDash userName={userName} />
      <StyledLowerDash cards={cards} user={userData} />
    </div>
  );
}

const StyledDashboard = styled(Dashboard)`

`;

export default StyledDashboard;
