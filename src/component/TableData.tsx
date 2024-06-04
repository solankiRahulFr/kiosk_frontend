
import {Table} from 'antd';
import type { TableProps } from 'antd';
import { DataType } from '../Types/types';



  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Dimension',
      dataIndex: 'dimension',
      key: 'dimension',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Business Unit',
      dataIndex: 'business_unit',
      key: 'business_unit',
    },
    {
      title: 'CO2 emissions',
      dataIndex: 'co2_emissions',
      key: 'co2_emissions',
    },
    {
      title: 'Total Revenue',
      dataIndex: 'total_revenue',
      key: 'total_revenue',
    },
    {
      title: 'Total headcount',
      key: 'total_headcount',
      render:(record:DataType) => record.male_headcount! + record.female_headcount!,
    },
    {
      title: 'Gender parity Ratio',
      key: 'gender_parity_ratio',
      render:(record:DataType) => {
        const totalHeadcount = record.male_headcount! + record.female_headcount!;
        return totalHeadcount === 0 ? 0 : (record.female_headcount! / totalHeadcount).toFixed(2);
    }
    }
  ];

export default function TableData({data}:{data:DataType[]}) {

  return (
    <Table columns={columns} dataSource={data} size="small" rowKey={(record:DataType) => record.dimension!+record.date!}/>
  )
}
