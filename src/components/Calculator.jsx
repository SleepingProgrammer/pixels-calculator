import {
  Box,
  Input,
  Select,
  Option,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import crops from "../assets/crops.json";
import Constants from "../Constants";
import Table from "@mui/joy/Table";
import { Star } from "@mui/icons-material";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import axios from "axios";
import currencies from "../assets/currencies.json";
function Calculator() {
  const [berryPrice, setBerryPrice] = useState("0.08");
  const [currency, setCurrency] = useState("php");
  const [data, setData] = useState([]);
  const [vipOn, setVipOn] = useState(false);

  const cropAnalysis = (crop) => {
    const dailyEnergy = Constants.TOTAL_ENERGY_PER_DAY;
    const wateringCanConsumption = Constants.TOOLS.WATERING_CAN.energy;
    const shearsConsumption = Constants.TOOLS.SHEARS.energy;

    const cropWatersRequired = crop?.Name.includes("Grumpkin") ? 2 : 1;
    const energyPerCrop = parseFloat(crop?.EnergyCost) * -1;
    console.log({
      energyPerCrop,
      energyPerCrop2: energyPerCrop * -1,
    });
    const costPerCrop = parseFloat(crop?.SeedPrice);
    const salesPerCrop = parseFloat(crop?.SellPrice);
    const profitPerCrop = salesPerCrop - costPerCrop;
    const totalEnergyPerCrop =
      cropWatersRequired * wateringCanConsumption +
      shearsConsumption +
      energyPerCrop;
    const profitPerEnergy = profitPerCrop / totalEnergyPerCrop;
    const plantablePerDay = Math.floor(dailyEnergy / totalEnergyPerCrop);
    const profitPerDay = profitPerCrop * plantablePerDay;

    //Non VIP
    const nonVipDailyEnergy =
      Constants.TOTAL_ENERGY_PER_DAY - Constants.TOTAL_VIP_ENERGY_PER_DAY;
    const nonVipPlantablePerDay = Math.floor(
      nonVipDailyEnergy / totalEnergyPerCrop
    );
    const nonVipProfitPerDay = profitPerCrop * nonVipPlantablePerDay;

    //actual profit per day
    const actualProfitPerDay = profitPerDay * berryPrice;
    const actualNonVipProfitPerDay = nonVipProfitPerDay * berryPrice;

    const _data = {
      cropWatersRequired,
      energyPerCrop,
      costPerCrop,
      salesPerCrop,
      profitPerCrop,
      totalEnergyPerCrop,
      profitPerEnergy,
      plantablePerDay,
      profitPerDay,
      nonVipDailyEnergy,
      nonVipPlantablePerDay,
      nonVipProfitPerDay,
      actualProfitPerDay,
      actualNonVipProfitPerDay,
    };
    return _data;
  };

  const analyzeAllCrops = () => {
    const _data = crops.map((crop) => {
      const _cropAnalysis = cropAnalysis(crop);
      return { ...crop, Data: _cropAnalysis };
    });

    console.log({ _data });
    return _data;
  };

  useEffect(() => {
    setData(analyzeAllCrops());
  }, [berryPrice]);

  useEffect(() => {
    const activeCurrency = currencies.find(
      (_currency) => _currency.id == currency
    );
    const currencyId = activeCurrency?.id;
    console.log({
      currency,
      currencies,
      currencyId,
      activeCurrency
    });
    if (currencyId) {
      //analyze all crops and set the data
      axios
        .get(
          `https://api.coingecko.com/api/v3/simple/price?ids=berry-pixels&vs_currencies=${currencyId}`
        )
        .then((res) => {
          console.log("res.data", res.data);
          console.log(res.data["berry-pixels"][currencyId]);
          setBerryPrice(res.data["berry-pixels"][currencyId]);
        });
    }
  }, [currency]);

  return (
    <Box
      sx={{
        py: 3,
        mt: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h1" color="white">
          {" "}
          Pixels Analysis by Jissi.ron{" "}
        </Typography>{" "}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Tooltip title="VIP/Non-VIP Toggle">
            <Typography level="h3" color="white">
              <IconButton
                onClick={() => {
                  setVipOn(!vipOn);
                }}
                size="small"
              >
                {vipOn ? (
                  <Star
                    sx={{
                      color: "gold",
                    }}
                  />
                ) : (
                  <StarBorderRoundedIcon
                    sx={{
                      color: "gold",
                    }}
                  />
                )}
              </IconButton>{" "}
              {vipOn ? "VIP" : "Non-VIP"}
            </Typography>
          </Tooltip>
          <Typography
            level="h3"
            color="white"
            sx={{
              ml: 2,
            }}
          >
            $BERRY Price
          </Typography>
          <Input
            sx={{
              ml: 1,
            }}
            onChange={(e) => {
              setBerryPrice(e.target.value);
            }}
            placeholder="Berry Price"
            value={berryPrice}
          />
          <Select
            sx={{
              ml: 1,
              minWidth: 100,
            }}
            onChange={(e, newValue) => {
              console.log({
                e: e?.target?.value,
                newValue,
              });
              setCurrency(newValue);
            }}
            value={currency}
            defaultValue="php" 
          >
            {currencies.map((currency) => (
              <Option selected={currency.id === "PHP"} value={currency.id}>
                {currency.label}
              </Option>
            ))}
          </Select>
        </Box>
      </Box>
      <Typography level="h5" sx={{ color: "gold" }}>
        Based on daily energy which includes VIP, SAUNA/POOL, and normal
        regeneration which is total of {Constants.TOTAL_ENERGY_PER_DAY} for VIP
        and{" "}
        {Constants.TOTAL_ENERGY_PER_DAY - Constants.TOTAL_VIP_ENERGY_PER_DAY}{" "}
        for non-VIP. (The 2.5% fee for withdrawal is not included in the
        calculations)
      </Typography>

      <Box>
        <Table
          aria-label="basic table"
          sx={{
            color: "white",
            "& thead": {
              backgroundColor: "red",
              "--TableCell-headBackground": "#232323", // Modify the variable for thead only
            },

            //center texts
            "& td": {
              textAlign: "center",
            },
            "& th": {
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.1rem",
              color: "gold",
            },
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "red",
              }}
            >
              <th style={{ width: "10%" }}>Crop</th>
              <th>Energy/Crop</th>
              <th>Profit/crop</th>
              <th>Plant/day</th>
              <th style={{ width: "15%" }}>Total Profit/day</th>
              <th style={{ width: "18%" }}>Total Profit/mo</th>
              <th style={{ width: "20%" }}>Total Profit/yr</th>
            </tr>
          </thead>
          <tbody>
            {
              //loop through the data and create a row for each crop
              data?.map((crop) => (
                <tr>
                  <td>{crop.Name}</td>
                  <td>{crop.Data?.totalEnergyPerCrop}</td>
                  <td>{crop.Data?.profitPerCrop}</td>
                  <td>
                    <Typography>
                      {vipOn
                        ? `${crop.Data?.plantablePerDay}`
                        : crop.Data.nonVipPlantablePerDay}
                    </Typography>
                  </td>
                  <td>
                    <Tooltip title="$BERRY/FIAT">
                      <Typography>
                        <span style={{ color: "gold" }}>
                          {" "}
                          🫐{" "}
                          {vipOn
                            ? `${crop.Data?.profitPerDay.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}`
                            : crop.Data.nonVipProfitPerDay.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}{" "}
                          {}
                        </span>
                        /💵
                        {vipOn
                          ? `${crop.Data?.actualProfitPerDay.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}`
                          : crop.Data.actualNonVipProfitPerDay.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                      </Typography>
                    </Tooltip>
                  </td>
                  <td>
                    <Tooltip title="$BERRY/FIAT">
                      <Typography>
                        <span style={{ color: "gold" }}>
                          {" "}
                          🫐{" "}
                          {vipOn
                            ? `${(crop.Data?.profitPerDay * 30).toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}`
                            : (
                                crop.Data.nonVipProfitPerDay * 30
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{" "}
                        </span>
                        /💵
                        {vipOn
                          ? `${(
                              crop.Data?.actualProfitPerDay * 30
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          : (
                              crop.Data.actualNonVipProfitPerDay * 30
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                      </Typography>
                    </Tooltip>
                  </td>
                  <td>
                    {" "}
                    <Tooltip title="$BERRY/FIAT">
                      <Typography>
                        <span style={{ color: "gold" }}>
                          {" "}
                          🫐{" "}
                          {vipOn
                            ? `${(
                                crop.Data?.profitPerDay *
                                30 *
                                12
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}`
                            : (
                                crop.Data.nonVipProfitPerDay *
                                30 *
                                12
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{" "}
                        </span>
                        /💵
                        {vipOn
                          ? `${(
                              crop.Data?.actualProfitPerDay *
                              30 *
                              12
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          : (
                              crop.Data.actualNonVipProfitPerDay *
                              30 *
                              12
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                      </Typography>
                    </Tooltip>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default Calculator;
