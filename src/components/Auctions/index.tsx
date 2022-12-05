import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import { SlideDown } from "react-slidedown";
import { Link } from "react-router-dom";

import { isEmpty } from "../../helpers/check";
import { getOwnerText } from "../../helpers/convert";
import { useAccount } from "wagmi";

const NETWORK_URL = "https://polygonscan.com/address/";

interface Props {
  auctions?: any[];
  loading?: boolean;
  heading: string;
  subheading: string;
}

const Auctions: React.FC<Props> = (props) => {
  const [page, setPage] = useState(4);
  const { address } = useAccount();

  const loadMoreHandler = () => {
    setPage(page + 4);
  };
  return (
    <section className="live-auctions-area load-more">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-7">
            {/* Intro */}
            <div className="intro text-center">
              <span>Auctions</span>
              <h3 className="mt-3 mb-0">{props.heading}</h3>
              <p>{props.subheading}</p>
            </div>
          </div>
        </div>
        {props.loading ? (
          <div className="row justify-content-center mt-5">
            <CircularProgress color="inherit" size={80}></CircularProgress>
          </div>
        ) : (
          <>
            <div className="row items">
              {props?.auctions &&
                props?.auctions.slice(0, page).map((item: any, idx: number) => {
                  return (
                    <div
                      key={`auct_${idx}`}
                      className="col-12 col-sm-6 col-lg-3 item"
                    >
                      <SlideDown>
                        <div className="card">
                          <div className="image-over">
                            <Link
                              to={`/item-details/${item.nftAddress}/${item.id}`}
                            >
                              <img
                                className="card-img-top"
                                src={item.img}
                                alt=""
                              />
                            </Link>
                          </div>
                          {/* Card Caption */}
                          <div className="card-caption col-12 p-0">
                            {/* Card Body */}
                            <div className="card-body">
                              <div className="countdown-times mb-3">
                                <div
                                  className="countdown d-flex justify-content-center"
                                  data-date={item.date}
                                />
                              </div>
                              <Link
                                to={`/item-details/${item.nftAddress}/${item.id}`}
                              >
                                <h5 className="mb-0">{item.title}</h5>
                              </Link>
                              <div className=" d-flex align-items-center my-3">
                                <span>Owned By</span>
                                <a
                                  className="seller"
                                  href={`${NETWORK_URL}${item.address}`}
                                  target="_blank"
                                >
                                  <h6 className="ml-2 mb-0">
                                    {getOwnerText(item.address, address ?? "")}
                                  </h6>
                                </a>
                              </div>
                              <div className="card-bottom d-flex justify-content-between">
                                <span>{item.startingPrice} MOON</span>
                                <span>{item.duration / 86400} days</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SlideDown>
                    </div>
                  );
                })}
            </div>
            {(props.auctions?.length ?? 0) > page && (
              <div className="row">
                <div className="col-12 text-center">
                  <button
                    id="load-btn"
                    className="btn btn-bordered-white mt-5"
                    onClick={loadMoreHandler}
                  >
                    Load More
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Auctions;
