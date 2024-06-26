import Path from './images/Path.png'
import moon from './images/Group 3.png'
import searchIconDark from './images/search.svg'
import searchIconLight from './images/search_light.svg'
import arrowDownLight from './images/Group 2_light.png'
import arrowDownDark from './images/Group 2.png'
import { useEffect, useState } from 'react'
// import CountryDetails from './CountryDetails'

async function fetchedData () {
  const res = await fetch('./data.json')
  const data = await res.json()
  return data
}

async function filterRegion (query) {
  const allCountries = await fetchedData()
  return allCountries.filter(country => country.region === query && country)
}

async function searchCountry (query) {
  try {
    const allCountries = await fetchedData()

    const data = allCountries.filter(country => {
      return country.name.toLowerCase().includes(query.toLowerCase()) && country
    })

    if (data.length === 0) throw new Error('No country found😥 try again')
    return data
  } catch (err) {
    throw err
  }
}

export default function App () {
  const [countries, setCountries] = useState([])
  const [error, setError] = useState('')
  const [showCountryDetails, setShowCountryDetails] = useState(false)
  const [searchedCountry, setSearchedCountry] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [showSelectedCountry, setShowSelectedCountry] = useState({})
  const [clickedBorder, setClickedBorder] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(function () {
    async function getAllCountriesData () {
      try {
        setIsLoading(true)
        setCountries(await fetchedData())
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }
    getAllCountriesData()
  }, [])

  useEffect(
    function () {
      async function getSelectedCountryDetails () {
        try {
          setIsLoading(true)
          const data = await searchCountry(selectedCountry)
          console.log(data)
          setShowSelectedCountry(...data)
        } catch (err) {
          console.log('Error fetching', err)
        } finally {
          setIsLoading(false)
        }
      }
      getSelectedCountryDetails()
    },
    [selectedCountry]
  )

  useEffect(
    function () {
      if (clickedBorder === '') return
      async function getBorderCountryDetails () {
        try {
          setIsLoading(true)
          const allCountries = await fetchedData()

          const borderCountry = allCountries.filter(
            country => country.alpha3Code === clickedBorder && country
          )
          setShowSelectedCountry(...borderCountry)
        } catch (err) {
          console.log()
        } finally {
          setIsLoading(false)
        }
      }
      getBorderCountryDetails()
    },
    [clickedBorder]
  )

  return (
    <div className='flex flex-col items-center'>
      <Nav />
      {!showCountryDetails && (
        <>
          <div className='lg:flex lg:items-center lg:justify-between lg:pl-5 lg:pr-5 relative mt-5 pl-5 pr-5 w-full'>
            <SearchInput
              setCountries={setCountries}
              searchedCountry={searchedCountry}
              setSearchedCountry={setSearchedCountry}
              setError={setError}
              setIsLoading={setIsLoading}
            />
            <FilterRegion
              setCountries={setCountries}
              setIsLoading={setIsLoading}
            />
          </div>

          {isLoading && <Loading />}
          {!error && !isLoading && (
            <div className='grid lg:grid-cols-4 sm:grid-cols-2 min-[800px]:grid-cols-3 lg:gap-14 gap-10 p-5 mt-3 rounded-t-md w-full'>
              {countries.map(country => (
                <AllCountries
                  country={country}
                  key={country.alpha3Code}
                  setShowCountryDetails={setShowCountryDetails}
                  setSelectedCountry={setSelectedCountry}
                />
              ))}
            </div>
          )}
          {error && <ErrorMessage error={error} />}
        </>
      )}

      {/* {showCountryDetails && (
        <CountryDetails
          showSelectedCountry={showSelectedCountry}
          setShowCountryDetails={setShowCountryDetails}
          setSearchedCountry={setSearchedCountry}
          searchedCountry={searchedCountry}
          setClickedBorder={setClickedBorder}
          isLoading={isLoading}
        />
      )
      } */}
    </div>
  )
}

function ErrorMessage ({ error }) {
  return <div className='text-4xl mt-10 flex text-white ml-10'>{error}</div>
}

function Loading () {
  return <p className='text-4xl mt-10 flex text-white ml-10'>Loading...</p>
}

function Nav () {
  return (
    <nav className='bg-white dark:bg-[#2B3844] flex justify-between p-5 shadow-xl items-center w-full'>
      <div className=''>
        <p className='font-semibold text-black dark:text-white'>
          Where in the world?
        </p>
      </div>
      <div className='flex gap-3 items-center'>
        <img src={Path} alt='moon' className='' />
        <button className='text-black btn-light-mode dark:text-white'>
          Dark mode
        </button>
      </div>
    </nav>
  )
}

function SearchInput ({
  setCountries,
  searchedCountry,
  setSearchedCountry,
  setError,
  setIsLoading
}) {
  useEffect(
    function () {
      async function getSearchedCountry () {
        if (searchedCountry === '') return
        setError('')
        setIsLoading(true)
        try {
          const data = await searchCountry(searchedCountry)
          setCountries(data)

          setError('')
        } catch (err) {
          setError(err.message)
        } finally {
          setIsLoading(false)
        }
      }
      getSearchedCountry()
    },
    [searchedCountry, setCountries, setError, setIsLoading]
  )
  return (
    <>
      <input
        type='text'
        className=' bg-white dark:bg-[#2B3844] p-4 rounded-md text-black dark:text-white indent-12 xl:indent-16 placeholder:font-[551] placeholder:text-xs lg:max-w-md search-coutry-el shadow-lg w-full'
        placeholder='Search for a country...'
        value={searchedCountry}
        onChange={e => setSearchedCountry(e.target.value)}
      />
      <img
        src={searchIconLight}
        alt='search'
        className='absolute top-[15%] left-9 w-4 lg:top-[40%] lg:left-[5%]'
      />
    </>
  )
}

function FilterRegion ({ setCountries, setIsLoading }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState('')

  function handleSelectedRegion (e) {
    setSelectedRegion(e.target.textContent)
    setIsOpen(isOpen => !isOpen)
  }

  useEffect(
    function () {
      if (selectedRegion === '') return
      async function getFilteredRegion () {
        try {
          setIsLoading(true)
          setCountries(await filterRegion(selectedRegion))
        } catch (err) {
        } finally {
          setIsLoading(false)
        }
      }
      getFilteredRegion()
    },
    [selectedRegion, setCountries, setIsLoading]
  )
  return (
    <div className='flex bg-white dark:bg-[#2B3844] mt-10 lg:mt-5 items-center justify-between max-w-52 p-4 rounded-md relative lg:gap-7 shadow-lg ml-2 lg:ml-0 w-full'>
      <p className='text-black dark:text-white text-xs w-full'>
        Filter by Region
      </p>
      <button onClick={() => setIsOpen(isOpen => !isOpen)}>
        <img src={arrowDownDark} alt='down arrow' className='' />
        <img src={arrowDownLight} alt='down arrow' className='hidden' />
      </button>

      {isOpen && (
        <div className='absolute top-[110%] bg-white dark:bg-[#2B3844] dark:text-white text-black shadow-lg left-0 p-3 w-full rounded-md pl-7 regions-el z-10'>
          <ul className='flex flex-col gap-1'>
            <li onClick={e => handleSelectedRegion(e)}>Africa</li>
            <li onClick={e => handleSelectedRegion(e)}>Americas</li>
            <li onClick={e => handleSelectedRegion(e)}>Asia</li>
            <li onClick={e => handleSelectedRegion(e)}>Europe</li>
            <li onClick={e => handleSelectedRegion(e)}>Oceania</li>
          </ul>
        </div>
      )}
    </div>
  )
}

function AllCountries ({
  country,
  setShowCountryDetails,
  setSelectedCountry,
  error
}) {
  const { name, population, region, capital } = country

  function handleClickedCountry () {
    setShowCountryDetails(isOpen => !isOpen)
    setSelectedCountry(name)
  }

  return (
    <>
      {error && <div>No country found</div>}
      {!error && (
        <div
          className='aspect-w-1 aspect-h-1 flex flex-col country cursor-pointer shadow-lg'
          onClick={() => handleClickedCountry()}
        >
          <div className='w-full'>
            <img
              src={country.flags.svg}
              alt='flag'
              className='rounded-t-md w-full aspect-[16/9] object-cover'
            />
          </div>
          <div className='text-white bg-[#2B3844] pt-7 pl-5 pb-12 h-full'>
            <h3 className='font-bold text-xl tracking-wide'>{name}</h3>
            <h4 className='mt-5 tracking-wide'>
              <span className='font-medium text-lg'>Population</span>:
              <span className='text-base'> {population}</span>
            </h4>
            <h4 className='mt-2 tracking-wide'>
              <span className='font-medium text-lg'>Region</span>:
              <span className='text-base'> {region}</span>
            </h4>
            <h4 className='mt-2 tracking-wide'>
              <span className='font-medium text-lg'>Capital</span>:
              <span className='text-base'> {capital}</span>
            </h4>
          </div>
        </div>
      )}
    </>
  )
}
