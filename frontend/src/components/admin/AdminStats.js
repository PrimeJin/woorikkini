import styles from './Admin.module.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { ResponsivePie } from '@nivo/pie';
import { useNavigate } from 'react-router-dom';

function AdminStats() {
  const [genderList, setGenderList] = useState([]);
  const [ageList, setAgeList] = useState([]);
  const [keywordList, setKeywordList] = useState([]);
  const chart = [
    { list: ageList, title: '연령 통계', color: { scheme: 'nivo' }, width: '500px' },
    {
      list: genderList,
      title: '성별 통계',
      color: { scheme: 'accent' },
      width: '500px',
    },
    {
      list: keywordList,
      title: '키워드 통계',
      color: { scheme: 'paired' },
      width: '100%',
    },
  ];
  const navigate = useNavigate();

  function getList() {
    axios({
      url: `https://i8a804.p.ssafy.io/api/stats`,
      method: 'GET',
    })
      .then((res) => {
        setAgeList(res.data.ageStatsList);
        setGenderList(res.data.genderStatsList);
        setKeywordList(res.data.keywordStatsList);
      })
      .catch((err) => {
        if (err.response.data.message === 'fail') {
          alert('로그인이 필요한 서비스입니다.');
          navigate('/user/login');
        } else {
          alert('유효하지 않은 요청입니다.');
          console.log(err, '관리자 회원통계 에러');
        }
      });
  }

  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      <div className={styles.admin}></div>
      <AdminSidebar />
      <div
        style={{
          marginLeft: '10%',
          justifyContent: 'center',
          display: 'flex',
          flexFlow: 'wrap row',
        }}
      >
        <h1 style={{ width: '100%' }}>회원 통계</h1>
        {chart.map((data, index) => (
          <div
            key={index}
            style={{
              width: `${data.width}`,
              height: '250px',
              margin: '20px',
            }}
          >
            <h3>{data.title}</h3>
            <ResponsivePie
              data={data.list}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              sortByValue={true}
              activeOuterRadiusOffset={8}
              colors={data.color}
              borderWidth={2}
              borderColor={{ theme: 'background' }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor={{ from: 'color', modifiers: [] }}
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 80,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000',
                      },
                    },
                  ],
                },
              ]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminStats;
