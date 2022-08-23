import React from "react";

import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  YouTube as YouTubeIcon
} from '@material-ui/icons'
import { Typography, IconButton, Tooltip } from '@material-ui/core'
import { Panel } from "../../components/commom_in";

function Equip() {
  return (
    <Panel>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            height: "100%",
            overflowY: 'auto',
            border: '1px solid #333',
            borderRadius: '5px'
          }}
        >
          <img
            src='https://drive.google.com/uc?export=view&id=1IK-QSK3PLj3nNOjYEM9LWLW38begGqyH'
            alt='Colaboradores'
            style={{
              width: '100%',
              maxWidth: '700px'
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography
            variant='h6'
            gutterBottom
          >
            NOSSAS REDES SOCIAIS
          </Typography>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Tooltip
              title={
                <div
                  style={{
                    fontSize: "14px",
                    color: "#FFF",
                    lineHeight: "20px"
                  }}
                >
                  <Typography color="inherit">Facebook</Typography>
                </div>
              }
              placement="bottom"
              arrow={true}
            >
              <IconButton
                onClick={() => window.open('http://facebook.com/pilaoprofessional', '_blank').focus()}
                style={{ color: '#4267B2' }}
                aria-label="Facebook"
              >
                <FacebookIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <div
                  style={{
                    fontSize: "14px",
                    color: "#FFF",
                    lineHeight: "20px"
                  }}
                >
                  <Typography color="inherit">Instagram</Typography>
                </div>
              }
              placement="bottom"
              arrow={true}
            >
              <IconButton
                onClick={() => window.open('http://instagram.com/pilaoprofessional_', '_blank').focus()}
                style={{ color: '#E1306C' }}
                aria-label="Instagram"
              >
                <InstagramIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <div
                  style={{
                    fontSize: "14px",
                    color: "#FFF",
                    lineHeight: "20px"
                  }}
                >
                  <Typography color="inherit">LinkedIn</Typography>
                </div>
              }
              placement="bottom"
              arrow={true}
            >
              <IconButton
                onClick={() => window.open('http://linkedin.com/company/pil%C3%A3o-professional', '_blank').focus()}
                style={{ color: '#0077B5' }}
                aria-label="LinkedIn"
              >
                <LinkedInIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <div
                  style={{
                    fontSize: "14px",
                    color: "#FFF",
                    lineHeight: "20px"
                  }}
                >
                  <Typography color="inherit">YouTube</Typography>
                </div>
              }
              placement="bottom"
              arrow={true}
            >
              <IconButton
                onClick={() => window.open('http://youtube.com/channel/UCZLxQndAv06x6nCL0PLThZQ', '_blank').focus()}
                style={{ color: '#FF0000' }}
                aria-label="YouTube"
              >
                <YouTubeIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default Equip;
