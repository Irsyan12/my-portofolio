import React, { useState, useEffect, useMemo } from "react";
import { FaGithub } from "react-icons/fa";

const GitHubContributionCard = ({
  monthsToShow = 6,
  username = "Irsyan12",
}) => {
  const [viewportWidth, setViewportWidth] = useState(1024);
  const [contributions, setContributions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const isSmallScreen = viewportWidth < 640;
  const isMediumScreen = viewportWidth >= 640 && viewportWidth < 1024;

  const CELL_SIZE = isSmallScreen ? 8 : isMediumScreen ? 10 : 12;
  const CELL_GAP = isSmallScreen ? 2 : 3;

  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);

    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch contribution data");
        }

        const data = await response.json();
        setContributions(
          Array.isArray(data.contributions) ? data.contributions : [],
        );
      } catch (err) {
        console.error("Contribution API Error:", err);
        setError("Contribution graph is unavailable right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributions();
  }, [username]);

  const contributionWeeks = useMemo(() => {
    if (!contributions.length) return [];

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsToShow);

    // Mundurkan ke hari Minggu terdekat agar grid selalu 7 baris
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Majukan end date ke hari Sabtu terdekat
    const endPad = new Date(endDate);
    endPad.setDate(endPad.getDate() + (6 - endPad.getDay()));

    const contributionMap = new Map(
      contributions.map((item) => [item.date, item]),
    );

    const weeks = [];
    let currentDate = new Date(startDate);
    let currentWeek = [];

    while (currentDate <= endPad) {
      // Mengatasi masalah zona waktu dengan local YYYY-MM-DD
      const offset = currentDate.getTimezoneOffset();
      const localDate = new Date(currentDate.getTime() - offset * 60 * 1000);
      const dateKey = localDate.toISOString().split("T")[0];

      // Jika data tidak ada, set level 0 (kotak abu-abu)
      currentWeek.push(
        contributionMap.get(dateKey) || { date: dateKey, count: 0, level: 0 },
      );

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return weeks;
  }, [contributions, monthsToShow]);

  const monthLabels = useMemo(() => {
    let previousMonth = "";

    return contributionWeeks.map((week) => {
      const firstDay = week[0];
      if (!firstDay) return "";

      const month = new Date(firstDay.date).toLocaleDateString("en-US", {
        month: "short",
      });

      if (month !== previousMonth) {
        previousMonth = month;
        return month;
      }

      return "";
    });
  }, [contributionWeeks]);

  const formatTooltipDate = (dateValue) => {
    return new Date(dateValue).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLevelClass = (level) => {
    const levelMap = {
      0: "bg-[#2d333b]",
      1: "bg-[#0e4429]",
      2: "bg-[#006d32]",
      3: "bg-[#26a641]",
      4: "bg-[#39d353]",
    };
    return levelMap[level] || levelMap[0];
  };

  return (
    <div className="p-4 max-w-md sm:p-5 font-jetbrains mx-auto">
      <div className="flex flex-col mx-auto gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={`https://github.com/${username}.png`}
            alt={`${username} GitHub avatar`}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/20 object-cover"
            loading="lazy"
          />
          <div>
            <p className="text-[11px] sm:text-xs text-gray-300">@{username}</p>
            <p className="text-[10px] sm:text-[11px] text-gray-500">
              GitHub activity overview
            </p>
          </div>
        </div>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-0 rounded-full bg-white/5 p-2 transition-all duration-300 hover:bg-white/10 hover:shadow-lg border border-transparent hover:border-white/10"
        >
          <FaGithub className="text-xl text-gray-400 group-hover:text-color1 transition-colors duration-300" />

          <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-all duration-300 ease-in-out">
            <span className="overflow-hidden whitespace-nowrap text-[10px] sm:text-xs text-gray-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 pl-0 group-hover:pl-2">
              View Profile
            </span>
          </div>
        </a>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] text-gray-400">
          Contribution Graph
        </p>
        <span className="text-[10px] sm:text-xs text-gray-300">
          Last {monthsToShow} months
        </span>
      </div>

      {isLoading ? (
        <div className="h-[160px] sm:h-[180px] rounded-xl border border-white/10 bg-white/5 animate-pulse" />
      ) : error ? (
        <div className="h-[160px] sm:h-[180px] rounded-xl border border-red-400/30 bg-red-400/10 text-red-200 text-xs sm:text-sm flex items-center justify-center px-4 text-center">
          {error}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center pb-4 relative z-10">
          <div className="w-max">
            <div
              className="relative mb-3 min-w-max h-4"
              style={{
                width: `${contributionWeeks.length * (CELL_SIZE + CELL_GAP)}px`,
              }}
            >
              {monthLabels.map((label, index) =>
                label ? (
                  <span
                    key={`${label}-${index}`}
                    className="absolute text-[10px] sm:text-[11px] leading-none text-gray-400 font-medium"
                    style={{
                      left: `${index * (CELL_SIZE + CELL_GAP)}px`,
                    }}
                  >
                    {label}
                  </span>
                ) : null,
              )}
            </div>

            <div
              className="inline-flex min-w-max pr-2"
              style={{ gap: `${CELL_GAP}px` }}
            >
              {contributionWeeks.map((week, weekIndex) => {
                const isLeftEdge = weekIndex < 4;
                const isRightEdge = weekIndex > contributionWeeks.length - 5;

                let tooltipPosition = "left-1/2 -translate-x-1/2";
                if (isLeftEdge) tooltipPosition = "left-0 translate-x-0";
                if (isRightEdge) tooltipPosition = "right-0 translate-x-0";

                return (
                  <div
                    key={weekIndex}
                    className="grid grid-rows-7"
                    style={{ gap: `${CELL_GAP}px` }}
                  >
                    {week.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className="relative group"
                      >
                        <div
                          className={`rounded-[2px] transition-colors duration-200 ${getLevelClass(day.level)}`}
                          style={{
                            width: `${CELL_SIZE}px`,
                            height: `${CELL_SIZE}px`,
                          }}
                        />

                        <div
                          className={`pointer-events-none absolute bottom-[120%] ${tooltipPosition} whitespace-nowrap rounded-md bg-black/90 px-2 py-1 text-[10px] sm:text-[11px] text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-50 shadow-lg shadow-black/30`}
                        >
                          {day.count} contributions on{" "}
                          {formatTooltipDate(day.date)}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 text-[10px] sm:text-[11px] text-gray-300">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <span
                  key={level}
                  className={`rounded-[2px] ${getLevelClass(level)}`}
                  style={{
                    width: `${CELL_SIZE}px`,
                    height: `${CELL_SIZE}px`,
                  }}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubContributionCard;
