import React from "react";
import { Link } from "react-router-dom";

import "./ratings-section.scss";

import RatingsTable from "../../../../copmonents/ratings-table/ratings-table";

import {
  demoRatingsTop5Users,
  demoUserRating,
} from "../../../../data/demo-data";

import translate from "../../../../i18n/translate";

const RatingsSection: React.FC = () => {
  const svg = require("../../../../assets/winner-cup.svg");
  return (
    <div className={`ratings-section__wrapper`}>
      <div className={`ratings-section u-container`}>
        <div className="ratings-section__description">
          <h1>{translate("homePage.ratingsSection.sectionHeader")}</h1>
          <img src={svg} width="100%" height="auto" />
        </div>
        <div className="ratings-section__table">
          <h1 className={"ratings-section__table-header"}>
            {translate("homePage.ratingsSection.leaderBoardHeader")}
          </h1>
          <RatingsTable
            data={demoRatingsTop5Users}
            currentUserData={demoUserRating}
          />
          <Link to={"/ratings"} className={"ratings-section__table-link"}>
            {translate("homePage.ratingsSection.link")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RatingsSection;
