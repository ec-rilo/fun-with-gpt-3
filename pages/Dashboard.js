import { useEffect, useState } from 'react';
import styled from 'styled-components';

// Assets
import { openai, requestOpenAI } from './api/openAi';

// Firebase
import { auth } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

// Components
import StyledNav from '../components/Nav';
import StyledContainer from '../components/Container';
import StyledDashboardIntro from '../components/DashboardIntro';
import { StyledBtn2 } from '../components/Btns';
import Card from '../components/Card';

/* ----------- UpperContainer Content ----------- */

const IntroCont = styled.div`
  max-width: 1280px;
  margin: auto;
`;

const StyledUpperCont = styled(UpperCont)`
  background-color: var(--clr-porcelain);
`;

const getFirstName = (name) => {
  const whitespaceIndex = name.indexOf(' ');
  const firstName = name.slice(0, whitespaceIndex);
  return firstName;
};

function UpperCont({ className }) {
  const [user, loading, error] = useAuthState(auth);
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(getFirstName(user.displayName));
    }
  }, [user]);

  return (
    <div className={className}>
      <StyledContainer fullPadding>
        <StyledNav dashboard userName={firstName}/>
        <IntroCont>
          <StyledDashboardIntro />
        </IntroCont>
      </StyledContainer>
    </div>
  );
}

/* ----------- LowerContainer Content ----------- */

function PromptCont({ className, addCard }) {
  const [userRequest, setUserRequest] = useState('');
  const [engine, setEngine] = useState('text-curie-001');

  const makeRequest = () => {
    requestOpenAI(engine, userRequest)
      .then((response) => {
        addCard(response, userRequest);
      })
      .catch((err) => {
        console.error('request failed: ', err);
      });
  }

  return (
    <div className={className}>
      <StyledPromptHeaderCont>
        <StyledH2>Enter prompt</StyledH2>
        <StyledSelect name="engines" id="engines" onChange={(e) => setEngine(e.target.value)}>
          <StyledOption value="text-curie-001">text-curie-001</StyledOption>
          <StyledOption value="text-davinci-002">text-davinci-002</StyledOption>
          <StyledOption value="text-babbage-001">text-babbage-001</StyledOption>
          <StyledOption value="text-ada-001">text-ada-001</StyledOption>
        </StyledSelect>
      </StyledPromptHeaderCont>
      <div>
        <StyledTextArea onChange={(e) => setUserRequest(e.target.value)}/>
      </div>
      <StyledSubmitBtnCont>
        <StyledBtn2 clickHandler={() => makeRequest()}
        text="Submit"
      />
      </StyledSubmitBtnCont>
    </div>
  );
}

const StyledPromptCont = styled(PromptCont)`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const StyledPromptHeaderCont = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledH2 = styled.h2`
  font-family: var(--fnt-bold);
  font-size: 1.3rem;
`;

const StyledSelect = styled.select`
  border-radius: 5px;
  cursor: pointer;
  padding: 8px 15px;
  font-family: var(--fnt-bold);
  font-size: 1rem;
`;

const StyledOption = styled.option`
  font-family: var(--fnt-bold);
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  height: 250px;
`;

const StyledSubmitBtnCont = styled.div`
  display: flex;
  justify-content: flex-end;
`;

function ResponsesCont({ className, cards }) {
  return (
    <div className={className}>
      <StyledPromptHeaderCont>
        <StyledRespHeaderCont>
          <StyledH2>Responses</StyledH2>
          <StyledP>{cards.length} responses</StyledP>
        </StyledRespHeaderCont>
        <StyledSelect name="responses-filter" id="responses-filter">
          <StyledOption value="most recent">Most recent</StyledOption>
          <StyledOption value="text-curie-001">text-curie-001</StyledOption>
          <StyledOption value="text-davinci-002">text-davinci-002</StyledOption>
          <StyledOption value="text-babbage-001">text-babbage-001</StyledOption>
          <StyledOption value="text-ada-001">text-ada-001</StyledOption>
        </StyledSelect>
      </StyledPromptHeaderCont>

      <StyledRespCardsCont>
        {cards.map((cardObj) => (
          <Card key={cardObj.id} cardData={cardObj} />
        ))}
      </StyledRespCardsCont>
    </div>
  );
}

const StyledResponsesCont = styled(ResponsesCont)`

`;

const StyledRespHeaderCont = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledP = styled.p`
  color: var(--clr-waikawa-grey);
  font-family: var(--fnt-medium);
`;

const StyledRespCardsCont = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 20px 0;
  gap: 50px;
  justify-content: space-between;
`;

function LowerCont({ className, cards, addCard }) {
  return (
    <div className={className}>
      <StyledContainer fullPadding>
        <IntroCont>
          <StyledPromptCont addCard={addCard} />
          <StyledResponsesCont cards={cards} />
        </IntroCont>
      </StyledContainer>
    </div>
  );
}

const StyledLowerCont = styled(LowerCont)`
  background-color: var(--clr-white);
`;

/* ----------- Dashboard Content ----------- */

function Dashboard({ className }) {
  const [user, loading, error] = useAuthState(auth);
  const [cards, setCards] = useState([]);

  const addCard = (cardData, userInput) => {
    const newCardData = { ...cardData };

    newCardData.userName = user.displayName;
    newCardData.userInput = userInput;
    newCardData.userImg = user.photoURL;

    let newCards = cards.slice();
    newCards.push(newCardData);
    newCards = newCards.reverse();
    setCards(newCards);
  }

  return (
    <div className={className}>
      <StyledUpperCont />
      <StyledLowerCont cards={cards} addCard={addCard} />
    </div>
  );
}

const StyledDashboard = styled(Dashboard)`

`;

export default StyledDashboard;
