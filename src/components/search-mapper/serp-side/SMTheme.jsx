import React from 'react'
import PropTypes from 'prop-types'
import styles from './SMTheme.module.scss'
import { SMResultGrouped } from './SMResultGrouped'

const MOCK_THEME = {
  id: '0000',
  title: 'Test Theme 1',
  saves: [
    {
      id: '0001',
      title: 'Test Grouped Result 1',
      url: 'https://github.com/jercymat',
      desc: 'We present a class of efficient models called MobileNets for mobile and embedded vision applications. MobileNets are based on a streamlined architecture that uses depth-wise separable convolutions to build light weight deep neural networks. We introduce two simple global hyper-parameters that efficiently trade off between latency and accuracy.'
    },
    {
      id: '0002',
      title: 'Test Grouped Result 2',
      url: 'https://github.com/jercymat',
      desc: 'We present a class of efficient models called MobileNets for mobile and embedded vision applications. MobileNets are based on a streamlined architecture that uses depth-wise separable convolutions to build light weight deep neural networks. We introduce two simple global hyper-parameters that efficiently trade off between latency and accuracy.'
    }
  ],
  note: '',
};

const REAL_THEME = {
  "id": 1,
  "name": "test01 default",
  "userid_id": 1,
  "searchResultList": [
    {
      "id": 19,
      "name": "Reduced Basis, Embedded Methods and Parametrized Levelset Geometry",
      "url": "https://arxiv.org/abs/2301.12401",
      "snippet": "Numerical experiments verify the efficiency of the introduced ``hello world'' problems considering reduced order results in several cases for one, two, three and four dimensional geometrical kind of parametrization. We investigate execution times, and we illustrate transport methods and improvements. A list of important references related to ...",
      "userid_id": 1,
      "groupid_id": 1,
      "rank": 1
    },
    {
      "id": 20,
      "name": "TVM: An Automated End-to-End Optimizing Compiler for Deep Learning",
      "url": "https://arxiv.org/abs/1802.04799",
      "snippet": "as high-level operator fusion, mapping to arbitrary hardware primitives, and memory latency hiding. It also automates optimization of low-level programs to hardware characteristics by employing a novel, learning-based cost modeling method for rapid exploration of code optimizations. Experimental results show",
      "userid_id": 1,
      "groupid_id": 1,
      "rank": 2
    },
    {
      "id": 21,
      "name": "Characterization of the LIGO detectors during their sixth science run",
      "url": "https://ar5iv.labs.arxiv.org/html/1410.7764",
      "snippet": "In 2009-2010, the LIGO operated together with international partners Virgo and GEO600 as a network to search for gravitational waves of astrophysical origin. The sensitivity of these detectors was limited by a combinat…",
      "userid_id": 1,
      "groupid_id": 1,
      "rank": 3
    }
  ],
  "note": []
}

export function SMTheme(props) {
  const { theme, onRenameTheme, onEditIdea } = props;

  return (
    <div className={styles.wrap}>
      <button type='button' className={styles['theme-title']} onClick={onRenameTheme}>{theme.name}</button>
      <div className={styles.results}>
        {
          theme.searchResultList.map(s => (
            <SMResultGrouped key={s.id} save={s} />
          ))
        }
      </div>
      <button type='button' className={styles.note} onClick={onEditIdea}>
        {
          theme.note !== ''
            ? <span>{theme.note}</span>
            : <span className={styles.placeholder}>Any ideas from these results?</span>
        }
      </button>
    </div>
  )
}

SMTheme.propTypes = {
  theme: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    searchResultList: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      desc: PropTypes.string.isRequired,
      imgUrl: PropTypes.string
    }).isRequired).isRequired,
    note: PropTypes.string.isRequired,
  }).isRequired,
  onRenameTheme: PropTypes.func.isRequired,
  onEditIdea: PropTypes.func.isRequired,
}
