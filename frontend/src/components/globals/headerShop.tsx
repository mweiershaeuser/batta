import React from "react";
import "../../styles/style.css";
//import SocialMedia from "./elements/socialMedia";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as HeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as HeartSolid } from "@fortawesome/free-solid-svg-icons";
//Brands
/* import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons"; */


import Shop from "../../models/shop";
import { useAppSelector } from "../../state/hooks.state";
import { selectShops } from "../../state/slices/shops.state";

interface params {
  UserId: any;
  imag: string;
  bgImage: string;
}

function HeaderShop(props: params) {

  const Shops = useAppSelector(selectShops);
  let data: Shop = Shops.find((e) => e.id === parseInt(props.UserId ?? "0"))!;

  const [favorite, setFavorite] = React.useState(false);
  const select =() =>{
    setFavorite(!favorite)
  }
  return (
    <header
      className="shop-header"
      style={{
        backgroundImage: `url(${process.env.REACT_APP_STRAPI}${data.shopHeaderImage?.url})`,
      }}
    >
      <div className="container">
        <div className="columns is-right">
          <div className="column is-3 is-offset-9 opening-hours content">
            <p>
                <b>Adresse:</b>
                <br />
                {data.address?.streetName + " " + data.address?.houseNumber}
                <br/>
                {data.address?.city + " " + data.address?.postalCode}
              </p>
              <p>
                <b>Öffnungszeiten:</b>
                <br/>
                {data.openingHours?.map(e => e.openTime?.substring(0,5) + " bis " + e.closeTime?.substring(0,5))}
              </p> 
          </div>
        </div>
        <div className="columns">
          <div className="column is-4 shop-short-info content">
            {/* <figure className="imageInhaber"></figure> */}
            <h2 className="title is-4 has-text-primary mgt-1 mgb-05">
              {data.shopName} &nbsp;
              <span>
                <FontAwesomeIcon
                onClick={select}  
                icon={ favorite ? HeartSolid : HeartRegular}
                color={ favorite ? "#257708" : " "} />
              </span>
            </h2>
            {data?.label?.map((e, i) => (
              <span className="tag" key={i}>
                {e.name}
              </span>
            ))}
            <p className="mgt-05">{data?.description}</p>
            {data.socialMedia?.map((e, i) => (
              <span className="socialMedia mgr-1 mgt-2" key={i}>
                <a href={e.url}>{e.platform}</a>
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderShop;
