import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
// intl
import translate from "../../translations/translate";
import { injectIntl } from "react-intl";
// redux
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  selectIsAllLevelTabsFetched,
  selectIsLevelTabsFetching,
  selectLevelTabsCurrentPage,
  selectLevelTabsList,
  selectLevelTabsPageSize,
  selectLevelTabsSortedBy,
  selectLevelTabsSortedDescending,
} from "../../redux/level-tabs/level-tabs-selectors";
import {
  selectGameTabsList,
  selectIsGameTabsFetching,
} from "../../redux/game-tabs/game-tabs.selectors";
import { fetchGameTabsStartAsync } from "../../redux/game-tabs/game-tabs.actions";
import { fetchLevelTabsStartAsync } from "../../redux/level-tabs/level-tabs.actions";
// components
import AppTabHeader from "../../copmonents/app-tab-header/app-tab-header";
import AppTabsList from "../../copmonents/app-tabs-list/app-tabs-list";
import AppSpinner from "../../copmonents/app-spinner/app-spinner";
import InfiniteScroll from "react-infinite-scroller";
import { Tab, Tabs } from "react-bootstrap";
// styles
import { AppTabProps } from "../../copmonents/app-tab/app-tab";
import { AppTabType } from "../../types/app-tabs/AppTab";
import {
  FetchLevelsRequestData,
  LevelsSortingProperty,
} from "../../redux/level-tabs/level-tabs.types";
import {
  FetchGamesRequestData,
  GamesSortingProperty,
} from "../../redux/game-tabs/game-tabs.types";
// data
import HEADER_TABS_STATE from "../../redux/header-tabs/header-tabs.state";
// styles
import "./player-info-page.scss";

interface PlayerInfoPageProps {
  intl: any;
  // REDUX PROPS
  // levels
  levelTabs: AppTabProps[];
  isLevelTabsFetching: boolean;
  isAllLevelTabsFetched: boolean;
  levelsTabsSortedBy: LevelsSortingProperty;
  levelTabsPageSize: number;
  levelTabsCurrentPage: number;
  levelsSortedByDescending: boolean;
  fetchLevelTabsStartAsync: (data: FetchLevelsRequestData) => void;
  // games
  gameTabs: AppTabProps[];
  isGameTabsFetching: boolean;
  fetchGameTabsStartAsync: (data: FetchGamesRequestData) => void;
}

const PlayerInfoPage: React.FC<PlayerInfoPageProps> = ({
  intl,
  // REDUX PROPS
  // levels
  levelTabs,
  isLevelTabsFetching,
  isAllLevelTabsFetched,
  levelsTabsSortedBy,
  levelsSortedByDescending,
  levelTabsPageSize,
  levelTabsCurrentPage,
  fetchLevelTabsStartAsync,
  // games
  gameTabs,
  fetchGameTabsStartAsync,
}) => {
  // translation vars
  const translationPrefix: string = "playerInfoPage";
  const titleId: string = translationPrefix + ".title";
  const gamesPlayedId: string = translationPrefix + ".gamesPlayed";
  const levelsCompletedId: string = translationPrefix + ".levelsCompleted";

  const { playerCode } = useParams();

  useEffect(() => {
    fetchGameTabsStartAsync({
      userCode: playerCode,
      gameCode: null,
      sortedBy: GamesSortingProperty.BY_USERS_COUNT,
      descending: true,
      offset: 0,
      limit: 10000,
    });
    fetchLevelTabsStartAsync({
      userCode: playerCode,
      gameCode: null,
      sortedBy: LevelsSortingProperty.BY_USERS_COUNT,
      descending: true,
      offset: 0,
      limit: levelTabsPageSize,
    });
  }, [playerCode]);

  const nextPage = () => {
    if (!isLevelTabsFetching) {
      fetchLevelTabsStartAsync({
        userCode: playerCode,
        gameCode: null,
        sortedBy: levelsTabsSortedBy,
        descending: levelsSortedByDescending,
        offset: levelTabsCurrentPage * levelTabsPageSize,
        limit: levelTabsPageSize,
      });
    }
  };

  return (
    <div className="player-info-page u-container">
      <h1>
        {translate(titleId)}: {playerCode}
      </h1>
      <Tabs defaultActiveKey="games" id="tabs">
        <Tab eventKey="games" title={intl.formatMessage({ id: gamesPlayedId })}>
          <div className="game-info-page__played-game-players">
            <AppTabHeader
              type={AppTabType.GAME}
              fields={HEADER_TABS_STATE[AppTabType.GAME]}
              refersTo={{ userCode: playerCode }}
            />
            {gameTabs ? (
              <AppTabsList tabs={gameTabs} />
            ) : (
              <AppSpinner loading={true} />
            )}
          </div>
        </Tab>
        <Tab
          eventKey="levels"
          title={intl.formatMessage({ id: levelsCompletedId })}
        >
          <AppTabHeader
            type={AppTabType.LEVEL}
            fields={HEADER_TABS_STATE[AppTabType.LEVEL]}
            refersTo={{ userCode: playerCode }}
          />
          {levelTabs ? (
            <InfiniteScroll
              loadMore={() => {
                nextPage();
              }}
              hasMore={!isAllLevelTabsFetched}
              loader={<AppSpinner loading={true} />}
            >
              <AppTabsList tabs={levelTabs} />
            </InfiniteScroll>
          ) : (
            <AppSpinner loading={true} />
          )}
        </Tab>
      </Tabs>
    </div>
  );
};

const mapStateToProps = createStructuredSelector<any, any>({
  isLevelTabsFetching: selectIsLevelTabsFetching,
  isAllLevelTabsFetched: selectIsAllLevelTabsFetched,
  levelTabs: selectLevelTabsList,
  isGameTabsFetching: selectIsGameTabsFetching,
  gameTabs: selectGameTabsList,
  levelsTabsSortedBy: selectLevelTabsSortedBy,
  levelsSortedByDescending: selectLevelTabsSortedDescending,
  levelTabsPageSize: selectLevelTabsPageSize,
  levelTabsCurrentPage: selectLevelTabsCurrentPage,
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchLevelTabsStartAsync: (data: FetchLevelsRequestData) =>
    dispatch(fetchLevelTabsStartAsync(data)),
  fetchGameTabsStartAsync: (data: FetchGamesRequestData) =>
    dispatch(fetchGameTabsStartAsync(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(PlayerInfoPage));
