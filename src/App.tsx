import { useState, useEffect } from "react";
import "./App.css";
import { Select, Radio, DatePicker } from "antd";
import { getAllDimensions, getIndicators } from "./services/esgIndcator";
import type { SelectProps } from "antd";
import { Dimension, DataType, Indicator, accData } from "./Types/types";
import TableData from "./component/TableData";
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';


function App() {
  const [allIndicators, setAllIndicators] = useState<DataType[]>([]);
  const [allDimensions, setAllDimensions] = useState([]);
  const [granularity, setGranularity] = useState(1);
  const [countries, setCountries] = useState<SelectProps[]>([]);
  const [businessUnit, setBusinessUnit] = useState<SelectProps[]>([]);
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-01-01');
  const [filterDimension, setfilterDimension] = useState([]);
  const [filterCountries, setFilterCountries] = useState<string[]>([]);
  const [filterUnits, setFilterUnits] = useState<string[]>([]);
  const { RangePicker } = DatePicker;


// getting all the dimesnions and selecting the unique country ad=nd business units
  useEffect(() => {
    getAllDimensions()
      .then((res) => {
        setAllDimensions(res.data.results)
        setfilterDimension(res.data.results)
        const countriesOb: SelectProps[] = [
          ...new Set(res.data.results.map((dim: Dimension) => dim.country)),
        ].map((country) => ({ label: country, value: country }));
        const unitOb: SelectProps[] = [
          ...new Set(
            res.data.results.map((dim: Dimension) => dim.business_unit)
          ),
        ].map((unit) => ({ label: unit, value: unit }));
        setCountries(countriesOb);
        setFilterCountries(countriesOb.map(x => x.value));
        setBusinessUnit(unitOb);
        setFilterUnits(unitOb.map(x => x.value))
      })
      .catch((error) => {
        console.error(error);
      });


  }, []);


// getting all indicators ans creating an array of object for the display
  useEffect(() => {
    const fetchData = async () => {
      const params = {
        start: startDate,
        end: endDate,
      }
      try {
        const res = await getIndicators(params);

        const indicators = res.data.results;

        const accData = indicators.reduce((acc: accData, item: Indicator) => {
          const key = `${item.dimension}-${item.date}`;
          if (!acc[key]) acc[key] = { dimension: item.dimension, date: item.date };
          acc[key][item.indicator] = item.value;
          return acc;
        }, {});


        const combinedArray: DataType[] = (Object.values(accData) as DataType[]).map((item) => {
          const countryBusinessUnit: Dimension = filterDimension.find((data: Dimension) => Number(data.id) === Number(item.dimension))!;

          return countryBusinessUnit && {
            ...item,
            country: countryBusinessUnit.country,
            business_unit: countryBusinessUnit.business_unit,
            co2_emissions: item.co2_emissions,
            total_revenue: item.total_revenue,
            female_headcount: item.female_headcount,
            male_headcount: item.male_headcount,
          };
        });

        const resultArray = combinedArray.filter(x => x);

// granularity change creating an array of object accumulated on the basis of the years 
        if (!granularity) {
          const result_year = resultArray.reduce<Record<string, DataType>>((acc, item) => {
            const key = `${dayjs(item.date).year()}-${item.dimension}`;
            if (!acc) {
              acc = {};
            }
            if (!acc[key]) {
              acc[key] = {
                date: String(dayjs(item.date).year()),
                total_revenue: 0,
                male_headcount: 0,
                female_headcount: 0,
                co2_emissions: 0,
                business_unit: "",
                dimension: 0,
                country: ""
              };
            }

            acc[key].total_revenue += item.total_revenue;
            acc[key].male_headcount += item.male_headcount;
            acc[key].female_headcount += item.female_headcount;
            acc[key].co2_emissions += item.co2_emissions;
            acc[key].country = item.country;
            acc[key].business_unit = item.business_unit;
            acc[key].dimension = item.dimension;

            return acc;
          }, {});


          setAllIndicators(Object.values(result_year))

        } else {
          setAllIndicators(resultArray);
        }


      } catch (error) {
        console.error('Error fetching indicators:', error);
      }
    };
    fetchData();
  }, [startDate, endDate, filterDimension, granularity]);

// updating the content of the table on the filters 
  useEffect(() => {
    const filterValues = allDimensions.filter((x: Dimension) => filterCountries.includes(x['country']) && filterUnits.includes(x['business_unit']))
    setfilterDimension(filterValues)
    console.log(dayjs('2023-01-01').year())
  }, [filterCountries, filterUnits, allDimensions, granularity]);


  // Date range selecting and updating the list
  type NoUndefinedRangeValueType<DateType> = [start: DateType | null, end: DateType | null];
  const handleRangeChange = (dates: NoUndefinedRangeValueType<Dayjs> | null) => {
    const [from, to] = dates as Dayjs[];
    if (from > dayjs('2023-01-01') && to < dayjs('2024-01-01')) {
      setStartDate(from.format('YYYY-MM-DD'));
      setEndDate(to.format('YYYY-MM-DD'));
    } else {
      alert("Date must be with the range of 2023-01-01 to 2024-01-01")
    }
  };


 

  return (
    <>
      <div className="filterNav">
        <div>
          <Radio.Group
            options={[
              { label: "Yearly", value: 0 },
              { label: "Monthly", value: 1 },
            ]}
            onChange={({ target: { value }, }) => setGranularity(value)}
            value={granularity}
            optionType="button"
          />
        </div>
        {granularity ? <div>
          <RangePicker
            defaultValue={[dayjs(startDate), dayjs(endDate)]}
            onChange={handleRangeChange}
            format="YYYY-MM-DD"
          />
        </div> : ''}
        <div>
          {countries.length > 0 && <Select
            mode="multiple"
            size={"middle"}
            placeholder="Country"
            defaultValue={countries}
            onChange={(value) => setFilterCountries(value as string[])}
            options={countries}
          />}
        </div>
        <div>
          {businessUnit.length > 0 && <Select
            mode="multiple"
            size={"middle"}
            placeholder="Country"
            defaultValue={businessUnit}
            onChange={(value) => setFilterUnits(value as string[])}
            options={businessUnit}
          />}
        </div>

      </div>
      <div className="conatiner">
        <div className="table">
          <TableData data={allIndicators} />
        </div>

      </div>
    </>
  );
}



export default App;
