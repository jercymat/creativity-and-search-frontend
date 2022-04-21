import SearchField from '../components/search/SearchField';
import LogoLarge from '../components/general/logo/LogoLarge';

function LandingPage() {
  return (
    <div id='im-landing-wrap' style={{
      width: '100%',
      position: 'absolute',
      top: '18%'
    }}>
      <LogoLarge id='im-main-logo' className='mb-4' />
      <SearchField
        id='im-search-area'
        className='w-50 mx-auto'
        placeholder='Your creativity starts here.'/>
    </div>
  )
}

export default LandingPage;