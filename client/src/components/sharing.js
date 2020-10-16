import React from "react";
import "../App.css";
import {Container, Tooltip, OverlayTrigger} from 'react-bootstrap';
import {
    FacebookShareButton, FacebookIcon, 
    LinkedinShareButton, LinkedinIcon,
    TwitterShareButton, TwitterIcon,
    EmailShareButton, EmailIcon,
    PinterestShareButton, PinterestIcon,
    WeiboShareButton, WeiboIcon,
  } from "react-share";

export default function Sharing(props){
  const shareUrl = window.location.href;
  const iconSize = 30;
  if(props.data && !props.loading){
    const pinterestImage = props.data.Product ? props.data.Product.main_image.publicUrl : props.data.Story.main_image.publicUrl;
    return(
      <Container className="sharing">
        <div className="social-icon">
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip("Facebook")}>
            <FacebookShareButton url={shareUrl}>
              <FacebookIcon size={iconSize} round/>
            </FacebookShareButton>
          </OverlayTrigger>
        </div>
        
        <div className="social-icon">
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip("LinkedIn")}>
            <LinkedinShareButton url={shareUrl}>
              <LinkedinIcon size={iconSize} round/>
            </LinkedinShareButton>
          </OverlayTrigger>
        </div>
        
        <div className="social-icon">
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip("Twitter")}>
            <TwitterShareButton url={shareUrl}>
              <TwitterIcon size={iconSize} round/>
            </TwitterShareButton>
          </OverlayTrigger>
        </div>
        
        <div className="social-icon">
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip("Pinterest")}>
            <PinterestShareButton
              url={shareUrl}
              media={pinterestImage} 
            >
              <PinterestIcon size={iconSize} round/>
            </PinterestShareButton>
          </OverlayTrigger>
        </div>

        <div className="social-icon">
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip("Weibo")}>
            <WeiboShareButton url={shareUrl}>
              <WeiboIcon size={iconSize} round/>
            </WeiboShareButton>
          </OverlayTrigger>
        </div>

        <div className="social-icon">
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip("Email")}>
            <EmailShareButton url={shareUrl}>
              <EmailIcon size={iconSize} round/>
            </EmailShareButton>
          </OverlayTrigger>
        </div>
      </Container>
    );
  }else{
    return null;
  }
}

function renderTooltip(text){
  return(
    <Tooltip id={"social-tooltip-" + text}> Share to {text}</Tooltip>
  );
}
