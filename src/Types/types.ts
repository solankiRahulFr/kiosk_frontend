export interface Indicator {
    date: string;
    dimension: string;
    indicator: string;
    value: number
}

export interface Dimension {
    id: number;
    country: string;
    business_unit: string
}

export interface SelectFilter {
    label: string | unknown;
    value: string 
}


export interface DataType {
    business_unit: string;
  co2_emissions: number;
  country: string;
  date: string;
  dimension: string | number;
  total_revenue: number;
  female_headcount: number;
  male_headcount: number;
    }

 export interface accData {
        [key: string]: {
            [indicator: string]: string|number; 
        };
    }