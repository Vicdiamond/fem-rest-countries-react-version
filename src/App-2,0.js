import Path from './images/Path.png'
import moon from './images/Group 3.png'
import searchIconDark from './images/search.svg'
import searchIconLight from './images/search_light.svg'
import arrowDownLight from './images/Group 2_light.png'
import arrowDownDark from './images/Group 2.png'
import { useEffect, useState } from 'react'
import CountryDetails from './CountryDetails'

async function fetchedData () {
  const res = await fetch('./data.json')
  const data = await res.json()
  return data
}

function BodyWrapper ({ isDarkMode }) {
  document.body.style.backgroundColor = isDarkMode ? '#2B3844' : '#ffffff'
  return null
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
  const [displayedCountry, setDisplayedCountry] = useState(countries)
  const [isDarkMode, setIsDarkmode] = useState(false)

  useEffect(function () {
    async function getAllCountriesData () {
      try {
        setError('')
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
      const selectedCountryDetails = countries.filter(
        country =>
          country.name.toLowerCase().includes(selectedCountry.toLowerCase()) &&
          country
      )

      setShowSelectedCountry(...selectedCountryDetails)
    },
    [selectedCountry, countries]
  )

  useEffect(
    function () {
      if (clickedBorder === '') return
      async function getBorderCountryDetails () {
        try {
          setIsLoading(true)

          const borderCountry = countries.filter(
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
    [clickedBorder, countries]
  )

  return (
    <div
      className={`flex flex-col items-center ${
        isDarkMode ? 'bg-[#2B3844]' : 'bg-white'
      }`}
    >
      <BodyWrapper isDarkMode={isDarkMode} />
      <Nav isDarkMode={isDarkMode} setIsDarkmode={setIsDarkmode} />
      {!showCountryDetails && (
        <>
          <div className='lg:flex lg:items-center lg:justify-between lg:pl-5 lg:pr-5 relative mt-5 pl-5 pr-5 w-full'>
            <SearchInput
              searchedCountry={searchedCountry}
              setSearchedCountry={setSearchedCountry}
              setError={setError}
              setIsLoading={setIsLoading}
              countries={countries}
              setDisplayedCountry={setDisplayedCountry}
              displayedCountry={displayedCountry}
              isDarkMode={isDarkMode}
            />
            <FilterRegion
              setCountries={setCountries}
              setIsLoading={setIsLoading}
              setDisplayedCountry={setDisplayedCountry}
              countries={countries}
              isDarkMode={isDarkMode}
            />
          </div>

          {isLoading && <Loading isDarkMode={isDarkMode} />}
          {!error && !isLoading && (
            <div className='grid lg:grid-cols-4 sm:grid-cols-2 min-[800px]:grid-cols-3 lg:gap-14 gap-10 p-5 mt-3 rounded-t-md w-full'>
              {displayedCountry.map(curDisplayedCountry => (
                <AllCountries
                  curDisplayedCountry={curDisplayedCountry}
                  key={curDisplayedCountry.alpha3Code}
                  setShowCountryDetails={setShowCountryDetails}
                  setSelectedCountry={setSelectedCountry}
                  isDarkMode={isDarkMode}
                  setIsDarkmode={setIsDarkmode}
                />
              ))}
            </div>
          )}
          {error && <ErrorMessage error={error} isDarkMode={isDarkMode} />}
        </>
      )}

      {showCountryDetails && (
        <CountryDetails
          showSelectedCountry={showSelectedCountry}
          setShowCountryDetails={setShowCountryDetails}
          setSearchedCountry={setSearchedCountry}
          searchedCountry={searchedCountry}
          setClickedBorder={setClickedBorder}
          isLoading={isLoading}
          isDarkmode={isDarkMode}
        />
      )}
    </div>
  )
}

function ErrorMessage ({ error, isDarkMode }) {
  return (
    <div
      className={`${
        isDarkMode ? 'text-white' : 'text-black'
      } text-4xl mt-10 flex ml-10 opacity-70`}
    >
      {error}
    </div>
  )
}

function Loading ({ isDarkMode }) {
  return (
    <p
      className={`${
        isDarkMode ? 'text-white' : 'text-black'
      } text-4xl mt-10 flex ml-10 opacity-70`}
    >
      Loading...
    </p>
  )
}

function Nav ({ isDarkMode, setIsDarkmode }) {
  return (
    <nav
      className={`${
        isDarkMode ? 'bg-[#2B3844]' : 'bg-white'
      } flex justify-between p-5 shadow-xl items-center w-full`}
    >
      <div className=''>
        <p
          className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          Where in the world?
        </p>
      </div>
      <div className='flex gap-3 items-center'>
        <img src={isDarkMode ? Path : moon} alt='moon' className='' />
        <button
          className={` ${isDarkMode ? 'text-white' : 'text-black'}`}
          onClick={() => setIsDarkmode(isDarkMode => !isDarkMode)}
        >
          Dark mode
        </button>
      </div>
    </nav>
  )
}

function SearchInput ({
  searchedCountry,
  setSearchedCountry,
  setError,
  setIsLoading,
  countries,
  setDisplayedCountry,
  isDarkMode
}) {
  useEffect(
    function () {
      try {
        if (searchedCountry === '') setDisplayedCountry(countries)

        setError('')
        setIsLoading(true)
        const displaySearchedCountry = countries.filter(
          country =>
            country.name
              .toLowerCase()
              .includes(searchedCountry.toLowerCase()) && country
        )

        if (displaySearchedCountry.length === 0)
          throw new Error('No country found')

        setDisplayedCountry(displaySearchedCountry)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    },
    [searchedCountry, countries, setDisplayedCountry, setError, setIsLoading]
  )
  return (
    <>
      <input
        type='text'
        className={`${
          isDarkMode ? 'bg-[#2B3844] text-white' : 'bg-white text-black '
        } p-4 rounded-md indent-12 xl:indent-16 placeholder:font-[551] placeholder:text-xs lg:max-w-md search-coutry-el shadow-lg w-full`}
        placeholder='Search for a country...'
        value={searchedCountry}
        onChange={e => setSearchedCountry(e.target.value)}
      />
      <img
        src={isDarkMode ? searchIconDark : searchIconLight}
        alt='search'
        className='absolute top-[15%] left-9 w-4 lg:top-[40%] lg:left-[5%]'
      />
    </>
  )
}

function FilterRegion ({ setDisplayedCountry, countries, isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false)

  function handleSelectedRegion (e) {
    const region = countries.filter(
      country => country.region === e.target.textContent && country
    )
    setIsOpen(isOpen => !isOpen)

    setDisplayedCountry(region)
  }

  return (
    <div
      className={`flex ${
        isDarkMode ? 'bg-[#2B3844]' : 'bg-white'
      } mt-10 lg:mt-5 items-center justify-between max-w-52 p-4 rounded-md relative lg:gap-7 shadow-lg ml-2 lg:ml-0 w-full`}
    >
      <p
        className={`${
          isDarkMode ? 'text-white' : 'text-black '
        }  text-xs w-full`}
      >
        Filter by Region
      </p>
      <button onClick={() => setIsOpen(isOpen => !isOpen)}>
        <img
          src={isDarkMode ? arrowDownDark : arrowDownLight}
          alt='down arrow'
          className=''
        />
      </button>

      {isOpen && (
        <div
          className={`absolute top-[110%] ${
            isDarkMode ? 'bg-[#2B3844] text-white' : 'bg-white text-black'
          }  dark: dark:  shadow-lg left-0 p-3 w-full rounded-md pl-7 regions-el z-10`}
        >
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
  curDisplayedCountry,
  setShowCountryDetails,
  setSelectedCountry,
  error,
  isDarkMode
}) {
  const { name, population, region, capital } = curDisplayedCountry

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
              src={curDisplayedCountry.flags.svg}
              alt='flag'
              className='rounded-t-md w-full aspect-[16/9] object-cover'
            />
          </div>
          <div
            className={`${
              isDarkMode ? 'bg-[#2B3844] text-white' : 'bg-white text-black'
            }   pt-7 pl-5 pb-12 h-full`}
          >
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
