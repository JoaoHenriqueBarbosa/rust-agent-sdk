// function: OverviewTab
function OverviewTab({
  stats,
  allTimeStats,
  dateRange,
  isLoading
}) {
  let {
    columns: terminalWidth
  } = useTerminalSize(), modelEntries = Object.entries(stats.modelUsage).sort(([, a2], [, b]) => b.inputTokens + b.outputTokens - (a2.inputTokens + a2.outputTokens)), favoriteModel = modelEntries[0], totalTokens = modelEntries.reduce((sum, [, usage]) => sum + usage.inputTokens + usage.outputTokens, 0), factoid = import_react192.useMemo(() => generateFunFactoid(stats, totalTokens), [stats, totalTokens]), rangeDays = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : stats.totalDays, shotStatsData = null;
  return /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    marginTop: 1,
    children: [
      allTimeStats.dailyActivity.length > 0 && /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginBottom: 1,
        children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(Ansi, {
          children: generateHeatmap(allTimeStats.dailyActivity, {
            terminalWidth
          })
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(DateRangeSelector, {
        dateRange,
        isLoading
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        gap: 4,
        marginBottom: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            width: 28,
            children: favoriteModel && /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
              wrap: "truncate",
              children: [
                "Favorite model:",
                " ",
                /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                  color: "claude",
                  bold: !0,
                  children: renderModelName(favoriteModel[0])
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            width: 28,
            children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
              wrap: "truncate",
              children: [
                "Total tokens:",
                " ",
                /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                  color: "claude",
                  children: formatNumber(totalTokens)
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        gap: 4,
        children: [
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            width: 28,
            children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
              wrap: "truncate",
              children: [
                "Sessions:",
                " ",
                /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                  color: "claude",
                  children: formatNumber(stats.totalSessions)
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            width: 28,
            children: stats.longestSession && /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
              wrap: "truncate",
              children: [
                "Longest session:",
                " ",
                /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                  color: "claude",
                  children: formatDuration(stats.longestSession.duration)
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        gap: 4,
        children: [
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            width: 28,
            children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
              wrap: "truncate",
              children: [
                "Active days: ",
                /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                  color: "claude",
                  children: stats.activeDays
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                  color: "subtle",
                  children: [
                    "/",
                    rangeDays
                  ]
                }, void 0, !0, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            width: 28,
            children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
              wrap: "truncate",
              children: [
                "Longest streak:",
                " ",
                /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                  color: "claude",
                  bold: !0,
                  children: stats.streaks.longestStreak
                }, void 0, !1, void 0, this),
                " ",
                stats.streaks.longestStreak === 1 ? "day" : "days"
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        gap: 4,
        children: [
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            width: 28,
            children: stats.peakActivityDay && /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
              wrap: "truncate",
              children: [
                "Most active day:",
                " ",
                /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                  color: "claude",
                  children: formatPeakDay(stats.peakActivityDay)
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            width: 28,
            children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
              wrap: "truncate",
              children: [
                "Current streak:",
                " ",
                /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                  color: "claude",
                  bold: !0,
                  children: allTimeStats.streaks.currentStreak
                }, void 0, !1, void 0, this),
                " ",
                allTimeStats.streaks.currentStreak === 1 ? "day" : "days"
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      !1,
      shotStatsData && /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(jsx_dev_runtime359.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
              children: "Shot distribution"
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
            flexDirection: "row",
            gap: 4,
            children: [
              /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                width: 28,
                children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                  wrap: "truncate",
                  children: [
                    shotStatsData.buckets[0].label,
                    ":",
                    " ",
                    /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                      color: "claude",
                      children: shotStatsData.buckets[0].count
                    }, void 0, !1, void 0, this),
                    /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                      color: "subtle",
                      children: [
                        " (",
                        shotStatsData.buckets[0].pct,
                        "%)"
                      ]
                    }, void 0, !0, void 0, this)
                  ]
                }, void 0, !0, void 0, this)
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                width: 28,
                children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                  wrap: "truncate",
                  children: [
                    shotStatsData.buckets[1].label,
                    ":",
                    " ",
                    /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                      color: "claude",
                      children: shotStatsData.buckets[1].count
                    }, void 0, !1, void 0, this),
                    /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                      color: "subtle",
                      children: [
                        " (",
                        shotStatsData.buckets[1].pct,
                        "%)"
                      ]
                    }, void 0, !0, void 0, this)
                  ]
                }, void 0, !0, void 0, this)
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
            flexDirection: "row",
            gap: 4,
            children: [
              /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                width: 28,
                children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                  wrap: "truncate",
                  children: [
                    shotStatsData.buckets[2].label,
                    ":",
                    " ",
                    /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                      color: "claude",
                      children: shotStatsData.buckets[2].count
                    }, void 0, !1, void 0, this),
                    /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                      color: "subtle",
                      children: [
                        " (",
                        shotStatsData.buckets[2].pct,
                        "%)"
                      ]
                    }, void 0, !0, void 0, this)
                  ]
                }, void 0, !0, void 0, this)
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                width: 28,
                children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                  wrap: "truncate",
                  children: [
                    shotStatsData.buckets[3].label,
                    ":",
                    " ",
                    /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                      color: "claude",
                      children: shotStatsData.buckets[3].count
                    }, void 0, !1, void 0, this),
                    /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                      color: "subtle",
                      children: [
                        " (",
                        shotStatsData.buckets[3].pct,
                        "%)"
                      ]
                    }, void 0, !0, void 0, this)
                  ]
                }, void 0, !0, void 0, this)
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
            flexDirection: "row",
            gap: 4,
            children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
              flexDirection: "column",
              width: 28,
              children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                wrap: "truncate",
                children: [
                  "Avg/session:",
                  " ",
                  /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
                    color: "claude",
                    children: shotStatsData.avgShots
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this)
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      factoid && /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
          color: "suggestion",
          children: factoid
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
