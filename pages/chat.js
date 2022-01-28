import React from 'react';
import { createClient } from '@supabase/supabase-js';
import appConfig from '../config.json';
import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import CircularProgress from '@mui/material/CircularProgress';

const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI2MDMxMywiZXhwIjoxOTU4ODM2MzEzfQ.LSA5by-ur_BIrTUY8qxbDS4qTOZ1bIc4ch38vt3ZEA4';

const SUPABASE_URL = 'https://xmvovlzvzihgmxhjtyvn.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {
  const [mensagem, setMensagem] = React.useState('');
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabaseClient
      .from('mensagens')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        setListaDeMensagens(data);
        setLoading(false);
      });
  }, []);

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      de: 'vitorgaletti',
      texto: novaMensagem
    };

    supabaseClient
      .from('mensagens')
      .insert([mensagem])
      .then(({ data }) => {
        setListaDeMensagens([data[0], ...listaDeMensagens]);
      });

    setMensagem('');
  }

  function handleExcluirMensagem(id) {
    const atualizadaListaDeMensagens = [...listaDeMensagens];
    const listaDeMensagensFiltradas = atualizadaListaDeMensagens.filter(
      mensagem => mensagem.id !== id
    );

    atualizadaListaDeMensagens.map(msg => {
      if (msg.id === id) {
        supabaseClient
          .from('mensagens')
          .delete()
          .match({ id: msg.id })
          .then(() => {
            setListaDeMensagens(listaDeMensagensFiltradas);
          });
      }
    });
  }

  return (
    <Box
      styleSheet={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px'
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px'
          }}
        >
          {loading ? (
            <Box
              styleSheet={{
                height: '100%',
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <CircularProgress disableShrink />
            </Box>
          ) : (
            <MessageList
              mensagens={listaDeMensagens}
              excluirMensagem={handleExcluirMensagem}
            />
          )}

          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <TextField
              value={mensagem}
              autoFocus={true}
              onChange={event => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={event => {
                if (mensagem.trim() === '') return;
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200]
              }}
            />
            <Button
              iconName="arrowRight"
              label="OK"
              colorVariant="positive"
              type="button"
              styleSheet={{
                marginBottom: '8px'
              }}
              onClick={() => {
                if (mensagem.trim() === '') return;
                handleNovaMensagem(mensagem);
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: '100%',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals['000'],
        marginBottom: '16px'
      }}
    >
      {props.mensagens.map(mensagem => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700]
              }
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px'
              }}
            >
              <Image
                styleSheet={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px'
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals[300]
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
            </Box>
            {mensagem.texto}

            <Button
              label="x"
              variant="tertiary"
              colorVariant="negative"
              styleSheet={{
                width: '20px',
                height: '20px',
                marginLeft: '10px',
                borderRadius: '50%'
              }}
              onClick={() => {
                props.excluirMensagem(mensagem.id);
              }}
            />
          </Text>
        );
      })}
    </Box>
  );
}
