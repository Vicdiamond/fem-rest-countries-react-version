import previousBtnDark from './images/call-made.svg'
import previousBtnLight from './images/call-made_light.svg'

export default function CountryDetails ({
  showSelectedCountry,
  setShowCountryDetails,
  setSearchedCountry,
  searchedCountry,
  setClickedBorder,
  isLoading,
  isDarkmode
}) {
  // const [isDarkMode]
  const {
    name,
    nativeName,
    population,
    region,
    subregion,
    capital,
    topLevelDomain,
    currencies,
    languages,
    borders,
    flag
  } = showSelectedCountry

  function handlePreviousPage () {
    setShowCountryDetails(isOpen => !isOpen)
    setSearchedCountry(searchedCountry)
  }

  console.log(isDarkmode)
  return (
    <div className='mt-12 flex-col gap-16 ml-3 mr-3 mb-5 flex'>
      {isLoading && (
        <p className='text-4xl mt-10 flex text-white ml-10'>Loading...</p>
      )}

      {!isLoading && (
        <>
          <div
            className={`${
              isDarkmode ? ' bg-[#2B3844] text-white' : 'bg-white text-black'
            } flex shadow-xl max-w-24 items-center justify-center gap-2 pt-1 pb-1 pr-3 pl-3 cursor-pointer`}
            onClick={() => handlePreviousPage()}
          >
            <img
              src={isDarkmode ? previousBtnDark : previousBtnLight}
              alt='Previous btn'
            />
            <button>Back</button>
          </div>
          <div className='flex flex-col gap-16 lg:items-center lg:justify-start xl:gap-28 min-[900px]:flex-row min-[900px]:gap-10 lg:gap-16'>
            <div className='lg:max-w-[560px]'>
              <img src={flag} alt='' className='' />
            </div>
            <div
              className={`${
                isDarkmode ? 'text-white' : ' text-black'
              } flex flex-col gap-7 lg:gap-4 w-full min-[900px]:gap-2`}
            >
              <p className='text-2xl font-semibold'>{name}</p>
              <div className='flex flex-col gap-12 lg:flex-row min-[900px]:flex-row'>
                <div className='flex flex-col gap-3 lg:gap-2 lg:flex-1 min-[900px]:gap-2'>
                  <p>
                    <span className='font-medium'>Native Name: </span>
                    <span
                      className={`text-sm ${
                        isDarkmode ? 'text-white' : 'text-black '
                      } text-opacity-70`}
                    >
                      {nativeName}
                    </span>
                  </p>
                  <p>
                    <span className='font-medium'>Population: </span>
                    <span
                      className={`text-sm ${
                        isDarkmode ? 'text-white' : '  text-black'
                      } text-opacity-70`}
                    >
                      {population}
                    </span>
                  </p>
                  <p>
                    <span className='font-medium'>Region: </span>
                    <span
                      className={`text-sm ${
                        isDarkmode ? 'text-white' : 'text-black'
                      } text-opacity-70`}
                    >
                      {region}
                    </span>
                  </p>
                  <p>
                    <span className='font-medium'>Sub Region: </span>
                    <span
                      className={`text-sm ${
                        isDarkmode ? 'text-white' : ' text-black'
                      } text-opacity-70`}
                    >
                      {subregion}
                    </span>
                  </p>
                  <p>
                    <span className='font-medium'>Capital: </span>
                    <span
                      className={`text-sm ${
                        isDarkmode ? 'text-white' : ' text-black'
                      } text-opacity-70`}
                    >
                      {capital}
                    </span>
                  </p>
                </div>
                <div className='flex flex-col gap-2 lg:flex-1 min-[900px]:gap-2 min-[900px]:'>
                  <p>
                    <span className='font-medium'> Top Level Domain: </span>
                    <span
                      className={`text-sm ${
                        isDarkmode ? 'text-white' : 'text-black '
                      } text-opacity-70`}
                    >
                      {topLevelDomain}
                    </span>
                  </p>
                  <p>
                    <span className='font-medium'>Currencies: </span>
                    <span
                      className={`text-sm ${
                        isDarkmode ? 'text-white' : ' text-black'
                      } text-opacity-70`}
                    >
                      {currencies[0].name}
                    </span>
                  </p>
                  <p>
                    <span className='font-medium'>Languages: </span>
                    <span
                      className={`text-sm ${
                        isDarkmode ? 'text-white' : ' text-black'
                      } text-opacity-70`}
                    >
                      {languages.length === 1
                        ? languages[0].name
                        : languages.map(language => language.name).join(', ')}
                    </span>
                  </p>
                </div>
              </div>
              <div className='mt-2 lg:mt-5 flex flex-col min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-3'>
                <p>Border Countries:</p>
                <div className='flex gap-3 mt-3 items-center flex-wrap lg:mt-0 min-[900px]:mt-0'>
                  {borders ? (
                    borders.map((border, i) => (
                      <CountryDetailsBorders
                        key={i}
                        setClickedBorder={setClickedBorder}
                        isDarkmode={isDarkmode}
                      >
                        {border}
                      </CountryDetailsBorders>
                    ))
                  ) : (
                    <CountryDetailsBorders>None</CountryDetailsBorders>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function CountryDetailsBorders ({ children, setClickedBorder, isDarkmode }) {
  function handleClickedBorder (children) {
    if (children === 'None') return

    setClickedBorder(children)
  }
  return (
    <p
      className={`pr-6 pl-6 pt-[5px] pb-[5px] text-sm drop-shadow-xl ${
        children !== 'None' && 'cursor-pointer'
      } ${isDarkmode ? 'bg-[#2B3844] text-white' : 'bg-white text-black'}`}
      onClick={() => handleClickedBorder(children)}
    >
      {children}
    </p>
  )
}
