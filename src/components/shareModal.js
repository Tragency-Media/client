import React from "react";
import ReactDOM from "react-dom";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";

const ShareModal = ({
  setActive,
  caption,
  id,
  tags = "#Tragency #travel #fun #travelVillage",
}) => {
  return ReactDOM.createPortal(
    <section
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        height: "100%",
        width: "100%",
        background: "rgba(0,0,0,0.4)",
        zIndex: "20",
      }}
      className="modal-wrapper"
      onClick={(e) => {
        if (e.target.classList.contains("modal-wrapper")) setActive(false);
      }}
    >
      <section
        style={{
          width: "30%",
          height: "30%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
          padding: "2vh 2vw",
          background: "#fff",
          borderRadius: "1rem",
        }}
      >
        <TwitterShareButton
          url={`${window.location.origin}/post/${id}`}
          quote={caption}
          hashtag={tags.split(" ")}
        >
          <TwitterIcon size={64} round={true} />
        </TwitterShareButton>
        <FacebookShareButton
          url={`${window.location.origin}/post/${id}`}
          quote={caption}
          hashtag={tags}
        >
          <FacebookIcon size={64} round={true} />
        </FacebookShareButton>
        <WhatsappShareButton
          url={`${window.location.origin}/post/${id}`}
          title={`Remotely connecting like minded travelers'. Come & connect with fellow travelers & post cool travel experience to become travel influencer. Come Take a look at this awesome post. 
          Caption: ${caption}`}
        >
          <WhatsappIcon size={64} round={true} />
        </WhatsappShareButton>
      </section>
    </section>,
    document.querySelector("#modal")
  );
};

export default ShareModal;
