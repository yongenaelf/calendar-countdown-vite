import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Deck,
  Slide,
  FlexBox,
  Box,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  Grid,
  Notes,
  Appear,
  Progress,
} from 'spectacle';

// Business-focused theme
const theme = {
  colors: {
    primary: '#0f172a',
    secondary: '#f97316',
    tertiary: '#ffffff',
    quaternary: '#64748b',
    quinary: '#0ea5e9',
  },
  fonts: {
    header: '"SF Pro Display", "Segoe UI", system-ui, sans-serif',
    text: '"SF Pro Text", "Segoe UI", system-ui, sans-serif',
    monospace: '"SF Mono", "Fira Code", monospace',
  },
  fontSizes: {
    h1: '64px',
    h2: '44px',
    h3: '36px',
    text: '24px',
    monospace: '16px',
  },
};

// Custom template
const template = () => (
  <FlexBox
    justifyContent="flex-end"
    position="absolute"
    bottom={0}
    width={1}
    padding="0 1em"
  >
    <Box padding="0.5em">
      <Progress color="secondary" size={4} />
    </Box>
  </FlexBox>
);

// Backgrounds
const darkGradient = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
const warmGradient = 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)';
const coolGradient = 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)';
const successGradient = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

const Presentation = () => (
  <Deck theme={theme} template={template}>
    {/* Title Slide */}
    <Slide backgroundColor="primary" backgroundImage={darkGradient}>
      <FlexBox height="100%" flexDirection="column" justifyContent="center" alignItems="center">
        <Text fontSize="80px" style={{ marginBottom: '0px' }}>📅</Text>
        <Heading fontSize="h1" color="tertiary" style={{ textAlign: 'center', marginTop: '10px' }}>
          Calendar Countdown
        </Heading>
        <Box 
          backgroundColor="secondary" 
          padding="8px 24px" 
          style={{ borderRadius: '30px', marginTop: '15px' }}
        >
          <Text fontSize="22px" color="tertiary" fontWeight="bold">
            Anticipate Every Moment
          </Text>
        </Box>
        <Text fontSize="18px" color="quaternary" style={{ marginTop: '40px' }}>
          Transforming How People Experience Time
        </Text>
      </FlexBox>
      <Notes>
        Welcome stakeholders! Today we're presenting Calendar Countdown - an app that transforms how people anticipate and plan for life's important moments.
      </Notes>
    </Slide>

    {/* The Insight */}
    <Slide backgroundColor="tertiary">
      <FlexBox height="100%" flexDirection="column" justifyContent="center" alignItems="center">
        <Text fontSize="90px" style={{ marginBottom: '15px' }}>💡</Text>
        <Heading fontSize="h2" color="primary" style={{ textAlign: 'center' }}>
          The Insight
        </Heading>
        <Text fontSize="28px" color="primary" style={{ textAlign: 'center', maxWidth: '750px', marginTop: '25px', lineHeight: 1.5 }}>
          People don't just want to <em>remember</em> important dates.
        </Text>
        <Text fontSize="32px" color="secondary" fontWeight="bold" style={{ textAlign: 'center', maxWidth: '750px', marginTop: '15px' }}>
          They want to <em>anticipate</em> them.
        </Text>
      </FlexBox>
    </Slide>

    {/* Market Problem */}
    <Slide backgroundColor="primary" backgroundImage={darkGradient}>
      <Heading fontSize="h2" color="tertiary">The Problem 😩</Heading>
      <Grid gridTemplateColumns="1fr 1fr" gridGap={20} style={{ marginTop: '25px' }}>
        <Box>
          <Appear>
            <Box backgroundColor="rgba(239,68,68,0.15)" padding="18px" style={{ borderRadius: '14px', marginBottom: '15px' }}>
              <Text fontSize="32px" style={{ marginBottom: '6px' }}>📆</Text>
              <Text fontSize="20px" color="tertiary" fontWeight="bold">Calendar Fatigue</Text>
              <Text fontSize="15px" color="quaternary" style={{ marginTop: '5px' }}>
                Traditional calendars are overwhelming and transactional
              </Text>
            </Box>
          </Appear>
          <Appear>
            <Box backgroundColor="rgba(239,68,68,0.15)" padding="18px" style={{ borderRadius: '14px' }}>
              <Text fontSize="32px" style={{ marginBottom: '6px' }}>😴</Text>
              <Text fontSize="20px" color="tertiary" fontWeight="bold">Lost Anticipation</Text>
              <Text fontSize="15px" color="quaternary" style={{ marginTop: '5px' }}>
                The joy of counting down to special days is gone
              </Text>
            </Box>
          </Appear>
        </Box>
        <Box>
          <Appear>
            <Box backgroundColor="rgba(239,68,68,0.15)" padding="18px" style={{ borderRadius: '14px', marginBottom: '15px' }}>
              <Text fontSize="32px" style={{ marginBottom: '6px' }}>🌍</Text>
              <Text fontSize="20px" color="tertiary" fontWeight="bold">Holiday Confusion</Text>
              <Text fontSize="15px" color="quaternary" style={{ marginTop: '5px' }}>
                Hard to track holidays across different cultures
              </Text>
            </Box>
          </Appear>
          <Appear>
            <Box backgroundColor="rgba(239,68,68,0.15)" padding="18px" style={{ borderRadius: '14px' }}>
              <Text fontSize="32px" style={{ marginBottom: '6px' }}>✈️</Text>
              <Text fontSize="20px" color="tertiary" fontWeight="bold">Wasted Leave Days</Text>
              <Text fontSize="15px" color="quaternary" style={{ marginTop: '5px' }}>
                People don't optimize their time off around holidays
              </Text>
            </Box>
          </Appear>
        </Box>
      </Grid>
    </Slide>

    {/* Our Solution */}
    <Slide backgroundColor="tertiary">
      <Heading fontSize="h2" color="primary">Our Solution ✨</Heading>
      <FlexBox justifyContent="center" style={{ marginTop: '20px' }}>
        <Box 
          backgroundColor="#fff" 
          padding="30px" 
          style={{ 
            borderRadius: '20px', 
            boxShadow: '0 20px 40px -12px rgba(0,0,0,0.12)',
            maxWidth: '680px'
          }}
        >
          <Text fontSize="24px" color="primary" style={{ textAlign: 'center', lineHeight: 1.6 }}>
            <strong style={{ color: '#f97316' }}>Calendar Countdown</strong> transforms date tracking into an 
            <strong style={{ color: '#0ea5e9' }}> anticipation-building experience</strong> that makes every 
            upcoming event feel exciting and worth looking forward to.
          </Text>
        </Box>
      </FlexBox>
      <Grid gridTemplateColumns="1fr 1fr 1fr" gridGap={30} style={{ marginTop: '35px' }}>
        <Appear>
          <FlexBox flexDirection="column" alignItems="center">
            <Text fontSize="50px">🎉</Text>
            <Text fontSize="18px" color="primary" fontWeight="bold">Celebrations</Text>
            <Text fontSize="14px" color="quaternary">Birthdays, anniversaries</Text>
          </FlexBox>
        </Appear>
        <Appear>
          <FlexBox flexDirection="column" alignItems="center">
            <Text fontSize="50px">🏖️</Text>
            <Text fontSize="18px" color="primary" fontWeight="bold">Vacations</Text>
            <Text fontSize="14px" color="quaternary">Travel countdowns</Text>
          </FlexBox>
        </Appear>
        <Appear>
          <FlexBox flexDirection="column" alignItems="center">
            <Text fontSize="50px">🎄</Text>
            <Text fontSize="18px" color="primary" fontWeight="bold">Holidays</Text>
            <Text fontSize="14px" color="quaternary">100+ countries</Text>
          </FlexBox>
        </Appear>
      </Grid>
    </Slide>

    {/* Key Features - Visual */}
    <Slide backgroundColor="primary" backgroundImage={warmGradient}>
      <Heading fontSize="h2" color="tertiary">Key Features</Heading>
      <Grid gridTemplateColumns="1fr 1fr" gridGap={18} style={{ marginTop: '20px' }}>
        <Appear>
          <Box backgroundColor="rgba(255,255,255,0.15)" padding="20px" style={{ borderRadius: '16px' }}>
            <Text fontSize="36px" style={{ marginBottom: '8px' }}>⏱️</Text>
            <Text fontSize="22px" color="tertiary" fontWeight="bold">Live Countdowns</Text>
            <Text fontSize="15px" color="rgba(255,255,255,0.8)" style={{ marginTop: '6px', lineHeight: 1.4 }}>
              Real-time countdown showing days, hours, minutes, seconds
            </Text>
          </Box>
        </Appear>
        <Appear>
          <Box backgroundColor="rgba(255,255,255,0.15)" padding="20px" style={{ borderRadius: '16px' }}>
            <Text fontSize="36px" style={{ marginBottom: '8px' }}>🌍</Text>
            <Text fontSize="22px" color="tertiary" fontWeight="bold">Global Holidays</Text>
            <Text fontSize="15px" color="rgba(255,255,255,0.8)" style={{ marginTop: '6px', lineHeight: 1.4 }}>
              One-tap import of public holidays from 100+ countries
            </Text>
          </Box>
        </Appear>
        <Appear>
          <Box backgroundColor="rgba(255,255,255,0.15)" padding="20px" style={{ borderRadius: '16px' }}>
            <Text fontSize="36px" style={{ marginBottom: '8px' }}>🧠</Text>
            <Text fontSize="22px" color="tertiary" fontWeight="bold">Smart Leave Planner</Text>
            <Text fontSize="15px" color="rgba(255,255,255,0.8)" style={{ marginTop: '6px', lineHeight: 1.4 }}>
              AI suggestions to maximize time off around holidays
            </Text>
          </Box>
        </Appear>
        <Appear>
          <Box backgroundColor="rgba(255,255,255,0.15)" padding="20px" style={{ borderRadius: '16px' }}>
            <Text fontSize="36px" style={{ marginBottom: '8px' }}>🎨</Text>
            <Text fontSize="22px" color="tertiary" fontWeight="bold">Beautiful Design</Text>
            <Text fontSize="15px" color="rgba(255,255,255,0.8)" style={{ marginTop: '6px', lineHeight: 1.4 }}>
              Delightful mobile-first UI with themes and dark mode
            </Text>
          </Box>
        </Appear>
      </Grid>
    </Slide>

    {/* User Journey */}
    <Slide backgroundColor="tertiary">
      <Heading fontSize="h2" color="primary">User Journey 🚀</Heading>
      <FlexBox justifyContent="center" alignItems="center" style={{ marginTop: '25px', gap: '12px' }}>
        <Appear>
          <Box backgroundColor="#fff" padding="14px 18px" width="150px" style={{ borderRadius: '12px', boxShadow: '0 6px 16px rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <Text fontSize="32px">📥</Text>
            <Text fontSize="14px" color="primary" fontWeight="bold" style={{ marginTop: '6px' }}>Download</Text>
            <Text fontSize="11px" color="quaternary">Open the app</Text>
          </Box>
        </Appear>
        <Appear><Text fontSize="20px" color="quaternary">→</Text></Appear>
        <Appear>
          <Box backgroundColor="#fff" padding="14px 18px" width="150px" style={{ borderRadius: '12px', boxShadow: '0 6px 16px rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <Text fontSize="32px">🌍</Text>
            <Text fontSize="14px" color="primary" fontWeight="bold" style={{ marginTop: '6px' }}>Select Country</Text>
            <Text fontSize="11px" color="quaternary">Auto-detected</Text>
          </Box>
        </Appear>
        <Appear><Text fontSize="20px" color="quaternary">→</Text></Appear>
        <Appear>
          <Box backgroundColor="#fff" padding="14px 18px" width="150px" style={{ borderRadius: '12px', boxShadow: '0 6px 16px rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <Text fontSize="32px">🎉</Text>
            <Text fontSize="14px" color="primary" fontWeight="bold" style={{ marginTop: '6px' }}>Import Holidays</Text>
            <Text fontSize="11px" color="quaternary">One-tap</Text>
          </Box>
        </Appear>
        <Appear><Text fontSize="20px" color="quaternary">→</Text></Appear>
        <Appear>
          <Box backgroundColor="#f97316" padding="14px 18px" width="150px" style={{ borderRadius: '12px', boxShadow: '0 6px 16px rgba(249,115,22,0.2)', textAlign: 'center' }}>
            <Text fontSize="32px">⏱️</Text>
            <Text fontSize="14px" color="tertiary" fontWeight="bold" style={{ marginTop: '6px' }}>Start Counting!</Text>
            <Text fontSize="11px" color="rgba(255,255,255,0.8)">Real-time</Text>
          </Box>
        </Appear>
      </FlexBox>
      <Appear>
        <Box style={{ marginTop: '30px', textAlign: 'center' }}>
          <Text fontSize="20px" color="secondary" fontWeight="bold">
            Time to value: Under 30 seconds ⚡
          </Text>
        </Box>
      </Appear>
    </Slide>

    {/* The Killer Feature - Leave Planner */}
    <Slide backgroundColor="primary" backgroundImage={coolGradient}>
      <FlexBox height="100%" flexDirection="column" justifyContent="center" alignItems="center">
        <Box backgroundColor="rgba(255,255,255,0.1)" padding="10px 24px" style={{ borderRadius: '30px', marginBottom: '15px' }}>
          <Text fontSize="16px" color="tertiary" fontWeight="bold">✨ FLAGSHIP FEATURE</Text>
        </Box>
        <Heading fontSize="48px" color="tertiary" style={{ textAlign: 'center' }}>
          Smart Leave Planner
        </Heading>
        <Text fontSize="22px" color="rgba(255,255,255,0.9)" style={{ textAlign: 'center', maxWidth: '650px', marginTop: '20px', lineHeight: 1.5 }}>
          Helps users maximize vacation time by finding optimal leave days around public holidays
        </Text>
        <Grid gridTemplateColumns="1fr 1fr 1fr" gridGap={25} style={{ marginTop: '35px' }}>
          <Appear>
            <Box backgroundColor="rgba(255,255,255,0.15)" padding="20px" style={{ borderRadius: '14px', textAlign: 'center' }}>
              <Text fontSize="32px" color="tertiary" fontWeight="bold">4x</Text>
              <Text fontSize="15px" color="rgba(255,255,255,0.8)">Days off per leave day</Text>
            </Box>
          </Appear>
          <Appear>
            <Box backgroundColor="rgba(255,255,255,0.15)" padding="20px" style={{ borderRadius: '14px', textAlign: 'center' }}>
              <Text fontSize="32px" color="tertiary" fontWeight="bold">9 days</Text>
              <Text fontSize="15px" color="rgba(255,255,255,0.8)">Mega break from 4 leave</Text>
            </Box>
          </Appear>
          <Appear>
            <Box backgroundColor="rgba(255,255,255,0.15)" padding="20px" style={{ borderRadius: '14px', textAlign: 'center' }}>
              <Text fontSize="32px" color="tertiary" fontWeight="bold">AI</Text>
              <Text fontSize="15px" color="rgba(255,255,255,0.8)">Destination suggestions</Text>
            </Box>
          </Appear>
        </Grid>
      </FlexBox>
    </Slide>

    {/* Leave Planner Example */}
    <Slide backgroundColor="tertiary">
      <Heading fontSize="h2" color="primary">Leave Planner in Action 📊</Heading>
      <Text fontSize="18px" color="quaternary" style={{ marginTop: '8px' }}>
        Example: Thursday public holiday
      </Text>
      <FlexBox justifyContent="center" alignItems="center" style={{ marginTop: '25px' }}>
        <Box backgroundColor="#fff" padding="25px 30px" style={{ borderRadius: '18px', boxShadow: '0 15px 35px rgba(0,0,0,0.08)' }}>
          {/* Day headers */}
          <FlexBox justifyContent="space-between" style={{ marginBottom: '12px', gap: '10px' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <Box key={day} style={{ width: '90px', textAlign: 'center' }}>
                <Text fontSize="15px" color="quaternary" fontWeight="bold">{day}</Text>
              </Box>
            ))}
          </FlexBox>
          {/* Day boxes */}
          <FlexBox justifyContent="space-between" style={{ gap: '10px' }}>
            <Box backgroundColor="#e2e8f0" style={{ width: '90px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text fontSize="14px" color="quaternary">Work</Text>
            </Box>
            <Box backgroundColor="#e2e8f0" style={{ width: '90px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text fontSize="14px" color="quaternary">Work</Text>
            </Box>
            <Box backgroundColor="#e2e8f0" style={{ width: '90px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text fontSize="14px" color="quaternary">Work</Text>
            </Box>
            <Box backgroundColor="#10b981" style={{ width: '90px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text fontSize="13px" color="tertiary" fontWeight="bold">Holiday</Text>
            </Box>
            <Box backgroundColor="#f97316" style={{ width: '90px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text fontSize="14px" color="tertiary" fontWeight="bold">Leave</Text>
            </Box>
            <Box backgroundColor="#0ea5e9" style={{ width: '90px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text fontSize="13px" color="tertiary" fontWeight="bold">Sat</Text>
            </Box>
            <Box backgroundColor="#0ea5e9" style={{ width: '90px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text fontSize="13px" color="tertiary" fontWeight="bold">Sun</Text>
            </Box>
          </FlexBox>
          {/* Legend */}
          <FlexBox justifyContent="center" style={{ marginTop: '15px', gap: '20px' }}>
            <FlexBox alignItems="center" style={{ gap: '6px' }}>
              <Box backgroundColor="#10b981" style={{ width: '12px', height: '12px', borderRadius: '3px' }} />
              <Text fontSize="12px" color="quaternary">Holiday</Text>
            </FlexBox>
            <FlexBox alignItems="center" style={{ gap: '6px' }}>
              <Box backgroundColor="#f97316" style={{ width: '12px', height: '12px', borderRadius: '3px' }} />
              <Text fontSize="12px" color="quaternary">Leave</Text>
            </FlexBox>
            <FlexBox alignItems="center" style={{ gap: '6px' }}>
              <Box backgroundColor="#0ea5e9" style={{ width: '12px', height: '12px', borderRadius: '3px' }} />
              <Text fontSize="12px" color="quaternary">Weekend</Text>
            </FlexBox>
          </FlexBox>
          <Box backgroundColor="#fef3c7" padding="14px 20px" style={{ borderRadius: '10px', marginTop: '15px' }}>
            <Text fontSize="17px" color="#92400e" fontWeight="bold" style={{ textAlign: 'center' }}>
              💡 Take 1 leave day (Friday) → Get 4 consecutive days off!
            </Text>
          </Box>
        </Box>
      </FlexBox>
    </Slide>

    {/* Target Market */}
    <Slide backgroundColor="primary" backgroundImage={darkGradient}>
      <Heading fontSize="h2" color="tertiary">Target Audience 🎯</Heading>
      <Grid gridTemplateColumns="1fr 1fr" gridGap={15} style={{ marginTop: '15px' }}>
        <Appear>
          <Box backgroundColor="rgba(255,255,255,0.08)" padding="14px 16px" style={{ borderRadius: '12px' }}>
            <FlexBox alignItems="center" style={{ gap: '12px' }}>
              <Text fontSize="28px">👨‍💼</Text>
              <Box>
                <Text fontSize="18px" color="tertiary" fontWeight="bold">Working Professionals</Text>
                <Text fontSize="13px" color="quaternary" style={{ marginTop: '4px' }}>
                  Maximize PTO • Plan vacations strategically
                </Text>
              </Box>
            </FlexBox>
          </Box>
        </Appear>
        <Appear>
          <Box backgroundColor="rgba(255,255,255,0.08)" padding="14px 16px" style={{ borderRadius: '12px' }}>
            <FlexBox alignItems="center" style={{ gap: '12px' }}>
              <Text fontSize="28px">👨‍👩‍👧‍👦</Text>
              <Box>
                <Text fontSize="18px" color="tertiary" fontWeight="bold">Families</Text>
                <Text fontSize="13px" color="quaternary" style={{ marginTop: '4px' }}>
                  Birthday countdowns • Holiday traditions
                </Text>
              </Box>
            </FlexBox>
          </Box>
        </Appear>
        <Appear>
          <Box backgroundColor="rgba(255,255,255,0.08)" padding="14px 16px" style={{ borderRadius: '12px' }}>
            <FlexBox alignItems="center" style={{ gap: '12px' }}>
              <Text fontSize="28px">🌏</Text>
              <Box>
                <Text fontSize="18px" color="tertiary" fontWeight="bold">Multicultural Users</Text>
                <Text fontSize="13px" color="quaternary" style={{ marginTop: '4px' }}>
                  Heritage holidays • Religious celebrations
                </Text>
              </Box>
            </FlexBox>
          </Box>
        </Appear>
        <Appear>
          <Box backgroundColor="rgba(255,255,255,0.08)" padding="14px 16px" style={{ borderRadius: '12px' }}>
            <FlexBox alignItems="center" style={{ gap: '12px' }}>
              <Text fontSize="28px">✈️</Text>
              <Box>
                <Text fontSize="18px" color="tertiary" fontWeight="bold">Travel Enthusiasts</Text>
                <Text fontSize="13px" color="quaternary" style={{ marginTop: '4px' }}>
                  Trip countdowns • AI destination suggestions
                </Text>
              </Box>
            </FlexBox>
          </Box>
        </Appear>
      </Grid>
    </Slide>

    {/* Competitive Advantage */}
    <Slide backgroundColor="tertiary">
      <Heading fontSize="h2" color="primary">Why We Win 🏆</Heading>
      <Grid gridTemplateColumns="1fr 1fr" gridGap={40} style={{ marginTop: '25px' }}>
        <Box>
          <Text fontSize="20px" color="quaternary" fontWeight="bold" style={{ marginBottom: '15px' }}>
            ❌ Traditional Calendar Apps
          </Text>
          <UnorderedList>
            <ListItem><Text fontSize="18px" color="primary">Just shows dates</Text></ListItem>
            <ListItem><Text fontSize="18px" color="primary">No emotional engagement</Text></ListItem>
            <ListItem><Text fontSize="18px" color="primary">Manual holiday entry</Text></ListItem>
            <ListItem><Text fontSize="18px" color="primary">No leave optimization</Text></ListItem>
            <ListItem><Text fontSize="18px" color="primary">Cluttered interface</Text></ListItem>
          </UnorderedList>
        </Box>
        <Box>
          <Text fontSize="20px" color="secondary" fontWeight="bold" style={{ marginBottom: '15px' }}>
            ✅ Calendar Countdown
          </Text>
          <UnorderedList>
            <ListItem><Text fontSize="18px" color="primary"><strong>Live countdowns</strong> build excitement</Text></ListItem>
            <ListItem><Text fontSize="18px" color="primary"><strong>Delightful UI</strong> users love</Text></ListItem>
            <ListItem><Text fontSize="18px" color="primary"><strong>One-tap import</strong> 100+ countries</Text></ListItem>
            <ListItem><Text fontSize="18px" color="primary"><strong>Smart planner</strong> maximizes PTO</Text></ListItem>
            <ListItem><Text fontSize="18px" color="primary"><strong>Focused design</strong> on what matters</Text></ListItem>
          </UnorderedList>
        </Box>
      </Grid>
    </Slide>

    {/* Key Metrics / Potential */}
    <Slide backgroundColor="primary" backgroundImage={successGradient}>
      <Heading fontSize="h2" color="tertiary">Market Opportunity 📈</Heading>
      <Grid gridTemplateColumns="1fr 1fr 1fr" gridGap={25} style={{ marginTop: '30px' }}>
        <Appear>
          <Box backgroundColor="rgba(255,255,255,0.15)" padding="28px" style={{ borderRadius: '18px', textAlign: 'center' }}>
            <Text fontSize="42px" color="tertiary" fontWeight="bold">3.5B+</Text>
            <Text fontSize="17px" color="rgba(255,255,255,0.8)">Smartphone users globally</Text>
          </Box>
        </Appear>
        <Appear>
          <Box backgroundColor="rgba(255,255,255,0.15)" padding="28px" style={{ borderRadius: '18px', textAlign: 'center' }}>
            <Text fontSize="42px" color="tertiary" fontWeight="bold">100+</Text>
            <Text fontSize="17px" color="rgba(255,255,255,0.8)">Countries with holiday data</Text>
          </Box>
        </Appear>
        <Appear>
          <Box backgroundColor="rgba(255,255,255,0.15)" padding="28px" style={{ borderRadius: '18px', textAlign: 'center' }}>
            <Text fontSize="42px" color="tertiary" fontWeight="bold">$47B</Text>
            <Text fontSize="17px" color="rgba(255,255,255,0.8)">Productivity app market</Text>
          </Box>
        </Appear>
      </Grid>
      <Appear>
        <Box backgroundColor="rgba(255,255,255,0.1)" padding="22px" style={{ borderRadius: '14px', marginTop: '30px' }}>
          <Text fontSize="20px" color="tertiary" style={{ textAlign: 'center', lineHeight: 1.5 }}>
            <strong>Universal Need:</strong> Everyone has dates they look forward to. We make that anticipation <strong>tangible and joyful</strong>.
          </Text>
        </Box>
      </Appear>
    </Slide>

    {/* Revenue Model */}
    <Slide backgroundColor="tertiary">
      <Heading fontSize="h2" color="primary">Business Model 💰</Heading>
      <Grid gridTemplateColumns="1fr 1fr 1fr" gridGap={20} style={{ marginTop: '25px' }}>
        <Appear>
          <Box backgroundColor="#fff" padding="22px" style={{ borderRadius: '18px', boxShadow: '0 12px 30px rgba(0,0,0,0.07)', textAlign: 'center' }}>
            <Box backgroundColor="#e0f2fe" padding="12px" style={{ borderRadius: '50%', width: '50px', height: '50px', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text fontSize="24px">🆓</Text>
            </Box>
            <Text fontSize="20px" color="primary" fontWeight="bold">Free Tier</Text>
            <Text fontSize="14px" color="quaternary" style={{ marginTop: '10px', lineHeight: 1.5 }}>
              Basic countdowns<br/>
              Manual event creation<br/>
              Limited colors
            </Text>
          </Box>
        </Appear>
        <Appear>
          <Box backgroundColor="#f97316" padding="22px" style={{ borderRadius: '18px', boxShadow: '0 12px 30px rgba(249,115,22,0.2)', textAlign: 'center' }}>
            <Box backgroundColor="rgba(255,255,255,0.2)" padding="12px" style={{ borderRadius: '50%', width: '50px', height: '50px', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text fontSize="24px">⭐</Text>
            </Box>
            <Text fontSize="20px" color="tertiary" fontWeight="bold">Premium</Text>
            <Text fontSize="13px" color="rgba(255,255,255,0.8)">$2.99/month</Text>
            <Text fontSize="14px" color="rgba(255,255,255,0.9)" style={{ marginTop: '10px', lineHeight: 1.5 }}>
              Unlimited events<br/>
              Leave Planner + AI<br/>
              All themes & widgets
            </Text>
          </Box>
        </Appear>
        <Appear>
          <Box backgroundColor="#fff" padding="22px" style={{ borderRadius: '18px', boxShadow: '0 12px 30px rgba(0,0,0,0.07)', textAlign: 'center' }}>
            <Box backgroundColor="#fef3c7" padding="12px" style={{ borderRadius: '50%', width: '50px', height: '50px', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text fontSize="24px">🏢</Text>
            </Box>
            <Text fontSize="20px" color="primary" fontWeight="bold">Enterprise</Text>
            <Text fontSize="14px" color="quaternary" style={{ marginTop: '10px', lineHeight: 1.5 }}>
              Team holidays<br/>
              Company events<br/>
              Admin dashboard
            </Text>
          </Box>
        </Appear>
      </Grid>
    </Slide>

    {/* Roadmap */}
    <Slide backgroundColor="primary" backgroundImage={darkGradient}>
      <Heading fontSize="h2" color="tertiary">Roadmap 🗺️</Heading>
      <Grid gridTemplateColumns="1fr 1fr 1fr 1fr" gridGap={15} style={{ marginTop: '25px' }}>
        <Appear>
          <Box style={{ borderLeft: '3px solid #10b981', paddingLeft: '15px' }}>
            <Text fontSize="13px" color="#10b981" fontWeight="bold">✅ NOW</Text>
            <Text fontSize="18px" color="tertiary" fontWeight="bold" style={{ marginTop: '8px' }}>MVP Launch</Text>
            <Text fontSize="13px" color="quaternary" style={{ marginTop: '8px', lineHeight: 1.5 }}>
              Live countdowns<br/>100+ countries<br/>Leave planner<br/>Dark mode
            </Text>
          </Box>
        </Appear>
        <Appear>
          <Box style={{ borderLeft: '3px solid #f97316', paddingLeft: '15px' }}>
            <Text fontSize="13px" color="#f97316" fontWeight="bold">Q2 2026</Text>
            <Text fontSize="18px" color="tertiary" fontWeight="bold" style={{ marginTop: '8px' }}>Growth</Text>
            <Text fontSize="13px" color="quaternary" style={{ marginTop: '8px', lineHeight: 1.5 }}>
              Push notifications<br/>Calendar sync<br/>Home widgets<br/>Social sharing
            </Text>
          </Box>
        </Appear>
        <Appear>
          <Box style={{ borderLeft: '3px solid #0ea5e9', paddingLeft: '15px' }}>
            <Text fontSize="13px" color="#0ea5e9" fontWeight="bold">Q3 2026</Text>
            <Text fontSize="18px" color="tertiary" fontWeight="bold" style={{ marginTop: '8px' }}>Expansion</Text>
            <Text fontSize="13px" color="quaternary" style={{ marginTop: '8px', lineHeight: 1.5 }}>
              Native iOS/Android<br/>Religious calendars<br/>Enterprise tier<br/>Partner API
            </Text>
          </Box>
        </Appear>
        <Appear>
          <Box style={{ borderLeft: '3px solid #8b5cf6', paddingLeft: '15px' }}>
            <Text fontSize="13px" color="#8b5cf6" fontWeight="bold">2027</Text>
            <Text fontSize="18px" color="tertiary" fontWeight="bold" style={{ marginTop: '8px' }}>Scale</Text>
            <Text fontSize="13px" color="quaternary" style={{ marginTop: '8px', lineHeight: 1.5 }}>
              AI travel booking<br/>Community events<br/>B2B partnerships<br/>Global expansion
            </Text>
          </Box>
        </Appear>
      </Grid>
    </Slide>

    {/* Team Ask */}
    <Slide backgroundColor="tertiary">
      <Heading fontSize="h2" color="primary">What We Need 🤝</Heading>
      <Grid gridTemplateColumns="1fr 1fr" gridGap={30} style={{ marginTop: '25px' }}>
        <Box backgroundColor="#fff" padding="25px" style={{ borderRadius: '18px', boxShadow: '0 12px 30px rgba(0,0,0,0.07)' }}>
          <Text fontSize="36px" style={{ marginBottom: '10px' }}>💵</Text>
          <Text fontSize="22px" color="primary" fontWeight="bold">Investment</Text>
          <Text fontSize="15px" color="quaternary" style={{ marginTop: '12px', lineHeight: 1.6 }}>
            • Native app development<br/>
            • Marketing & user acquisition<br/>
            • Infrastructure scaling
          </Text>
        </Box>
        <Box backgroundColor="#fff" padding="25px" style={{ borderRadius: '18px', boxShadow: '0 12px 30px rgba(0,0,0,0.07)' }}>
          <Text fontSize="36px" style={{ marginBottom: '10px' }}>🌐</Text>
          <Text fontSize="22px" color="primary" fontWeight="bold">Partnerships</Text>
          <Text fontSize="15px" color="quaternary" style={{ marginTop: '12px', lineHeight: 1.6 }}>
            • Travel booking platforms<br/>
            • Calendar app integrations<br/>
            • Enterprise HR systems
          </Text>
        </Box>
      </Grid>
      <Appear>
        <Box backgroundColor="#fef3c7" padding="18px" style={{ borderRadius: '14px', marginTop: '25px' }}>
          <Text fontSize="20px" color="#92400e" style={{ textAlign: 'center' }}>
            🎯 <strong>Goal:</strong> 100,000 active users in Year 1 with 10% premium conversion
          </Text>
        </Box>
      </Appear>
    </Slide>

    {/* Summary */}
    <Slide backgroundColor="primary" backgroundImage={warmGradient}>
      <Heading fontSize="h2" color="tertiary">In Summary 📝</Heading>
      <Grid gridTemplateColumns="1fr 1fr" gridGap={15} style={{ marginTop: '20px' }}>
        <Appear>
          <Box backgroundColor="rgba(255,255,255,0.15)" padding="14px 16px" style={{ borderRadius: '12px' }}>
            <FlexBox alignItems="center" style={{ gap: '12px' }}>
              <Text fontSize="28px">🎯</Text>
              <Box>
                <Text fontSize="17px" color="tertiary" fontWeight="bold">Clear Problem</Text>
                <Text fontSize="13px" color="rgba(255,255,255,0.75)">Anticipate, not just remember dates</Text>
              </Box>
            </FlexBox>
          </Box>
        </Appear>
        <Appear>
          <Box backgroundColor="rgba(255,255,255,0.15)" padding="14px 16px" style={{ borderRadius: '12px' }}>
            <FlexBox alignItems="center" style={{ gap: '12px' }}>
              <Text fontSize="28px">✨</Text>
              <Box>
                <Text fontSize="17px" color="tertiary" fontWeight="bold">Unique Solution</Text>
                <Text fontSize="13px" color="rgba(255,255,255,0.75)">Countdowns + smart leave planning</Text>
              </Box>
            </FlexBox>
          </Box>
        </Appear>
        <Appear>
          <Box backgroundColor="rgba(255,255,255,0.15)" padding="14px 16px" style={{ borderRadius: '12px' }}>
            <FlexBox alignItems="center" style={{ gap: '12px' }}>
              <Text fontSize="28px">🌍</Text>
              <Box>
                <Text fontSize="17px" color="tertiary" fontWeight="bold">Global Market</Text>
                <Text fontSize="13px" color="rgba(255,255,255,0.75)">100+ countries, universal need</Text>
              </Box>
            </FlexBox>
          </Box>
        </Appear>
        <Appear>
          <Box backgroundColor="rgba(255,255,255,0.15)" padding="14px 16px" style={{ borderRadius: '12px' }}>
            <FlexBox alignItems="center" style={{ gap: '12px' }}>
              <Text fontSize="28px">💰</Text>
              <Box>
                <Text fontSize="17px" color="tertiary" fontWeight="bold">Clear Monetization</Text>
                <Text fontSize="13px" color="rgba(255,255,255,0.75)">Freemium + Premium + Enterprise</Text>
              </Box>
            </FlexBox>
          </Box>
        </Appear>
      </Grid>
    </Slide>

    {/* Thank You / CTA */}
    <Slide backgroundColor="primary" backgroundImage={darkGradient}>
      <FlexBox height="100%" flexDirection="column" justifyContent="center" alignItems="center">
        <Text fontSize="80px" style={{ marginBottom: '15px' }}>📅</Text>
        <Heading fontSize="56px" color="tertiary">Thank You!</Heading>
        <Text fontSize="24px" color="quinary" style={{ marginTop: '15px' }}>
          Let's help people anticipate every moment.
        </Text>
        <Box style={{ marginTop: '40px' }}>
          <Box 
            backgroundColor="secondary" 
            padding="16px 40px" 
            style={{ borderRadius: '14px' }}
          >
            <Text fontSize="22px" color="tertiary" fontWeight="bold">
              🚀 Demo
            </Text>
          </Box>
        </Box>
      </FlexBox>
    </Slide>
  </Deck>
);

createRoot(document.getElementById('app')!).render(<Presentation />);
