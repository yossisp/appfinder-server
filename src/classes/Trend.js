const debug = require('debug')('classes:trend');

class Trend {
  constructor(trendData) {
    this.trendData = trendData;
    debug(`trendData = ${this.trendData[0]}`);

    this.subsetData = () => {
      this.trendData = this.trendData.filter(elem => elem.hasData[0]);
    };

    this.formatData = () => {
      this.trendData = this.trendData.map((elem) => {
        const { time, value } = elem;
        const [val] = value;
        return {
          milliseconds: `${time}000`,
          value: val
        };
      });
    };

    this.convertTimestampToDate = () => {
      this.trendData = this.trendData.map((elem) => {
        const { milliseconds, value } = elem;
        try {
          const millisecondsToInt = Number.parseInt(milliseconds, 10);
          const fullDate = new Date(millisecondsToInt);
          const day = fullDate.getDate();
          const month = fullDate.getMonth() + 1; // it's zero-indexed
          const year = fullDate.getFullYear();
          const formattedDate = `${day}-${month}-${year}`;
          return {
            milliseconds,
            formattedDate,
            value
          };
        } catch (e) {
          debug(e);
        }
      });
    };

    this.getTrendData = () => {
      this.subsetData();
      this.formatData();
      this.convertTimestampToDate();
      return this.trendData;
    };
  }
}

module.exports = Trend;
