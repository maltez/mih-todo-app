class AlgorithmPositive {

  constructor() {
    Object.assign(this, {});
  }

  getBalancedRecommendations(data) {
    var estimation = data.estimation,
        availableHoursPerDay = data.availableHoursPerDay,
        availableDaysAmount = data.availableDaysAmount,
        recommendations = {},
        balancedDuration,
        extraHours;

    availableHoursPerDay.sort((a, b) => a.freeTime != b.freeTime ? b.freeTime - a.freeTime : Date(b.date) - Date(a.date));

    balancedDuration = (Math.floor(estimation / availableDaysAmount * 2) / 2).toFixed(2); // Round to the nearest 0.5
    extraHours = estimation - availableDaysAmount * balancedDuration;

    availableHoursPerDay.map(function (day) {
      day.proposedSlotDuration = (extraHours >= 0.5 ? (extraHours -= 0.5, 0.5) : 0) + parseFloat(balancedDuration);
      recommendations[day.date] = day.proposedSlotDuration;

      return day;
    });

    return recommendations;
  }

  getIntensiveRecommendations(data) {
    var hoursToDistribute = data.estimation,
        availableHoursPerDay = data.availableHoursPerDay,
        availableDaysAmount = data.availableDaysAmount,
        recommendedDuration = data.recommendedDuration,
        dayIndex = 0,
        arrayWithRecommendations = new Array(availableDaysAmount).fill(0),
        recommendations = {},
        slot;

    while (hoursToDistribute) {
      slot = (hoursToDistribute >= recommendedDuration) ? recommendedDuration : hoursToDistribute;
      arrayWithRecommendations[dayIndex] += slot;
      hoursToDistribute -= slot;
      dayIndex = (dayIndex < availableDaysAmount - 1) ? dayIndex + 1 : 0;
    }

    availableHoursPerDay.sort((a, b) => Date(a.date) - Date(b.date));
    availableHoursPerDay.map(function (day, dayIndex) {
      day.proposedSlotDuration = arrayWithRecommendations[dayIndex];
      recommendations[day.date] = arrayWithRecommendations[dayIndex];

      return day;
    });

    return recommendations;
  }
}

angular.module('algorithm').service('AlgorithmPositive', AlgorithmPositive);
