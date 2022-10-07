import React from 'react';
import { Caption, Slide, Slider } from "react-materialize";

import { Button } from '@material-ui/core';

import { BoxTitle } from '../../components/commom_in';

function News({ onOpenModal, News, onOpenNewVPNModal }) {

  return (
    <Slider
      fullscreen={false}
      options={{
        duration: 500,
        height: 600,
        indicators: true,
        interval: 6000,
      }}
    >
      {/* <Slide image={<img alt="" src={`https://source.unsplash.com/1280x720/?coffee/${727}`} />}>
        <Caption
          placement="center"
        >
          <BoxTitle>
            <h3>Nova VPN Pilao Professional</h3>
            <h5 className="light grey-text text-lighten-3">
              A atualização de VPN para acesso a rede Pilão Professional entra em vigor a partir do dia XX/XX/2022
            </h5>
          </BoxTitle>
          <Button
            style={{
              margin: '100px 0px 0px 0px'
            }}
            onClick={onOpenNewVPNModal}
            variant='contained'
            color='secondary'
          >
            Saiba mais
          </Button>
        </Caption>
      </Slide> */}

      {News.map(n => (
        <Slide
          key={n.NewsId}
          image={
            <img
              alt=""
              src={`https://source.unsplash.com/1280x720/?coffee/${n.NewsId}`}
            // src={`https://source.unsplash.com/random/1280x720?sig=${n.NewsId}`}
            />
          }
        >
          <Caption
            placement={n.BannerAlign}
          >
            <BoxTitle>
              <h3>{n.BannerTitle}</h3>
              <h5>
                {n.BannerDescription}
              </h5>
            </BoxTitle>
            {n.ModalContent !== null ?
              <Button
                style={{
                  margin: '100px 0px 0px 0px'
                }}
                onClick={() => onOpenModal(n)}
                variant='contained'
                color='primary'
              >
                Saiba mais
              </Button>
              :
              null
            }
          </Caption>
        </Slide>
      ))}
    </Slider>
  );
}

export default News;
