'use client'
import { useAccount, useContractRead } from 'wagmi'
import NFT from '../artifacts/contracts/CryptoAqsha.sol/CryptoAqsha.json'
import { useState, useEffect } from 'react'
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
  const { address } = useAccount()
  const { data } = useContractRead({
    address: '0x7Cc4390fa2557AA795467059dA753d76DeE71C35',
    abi: NFT.abi,
    functionName: 'getTokensForAddress',
    args: [address],
  });

  const [nftDataArray, setNftDataArray] = useState([]);

  useEffect(() => {
    const fetchImageURLs = async () => {
      const nftDataArray = [];
      if (data !== undefined) {
        for (const ipfsURI of data) {
          try {
            const response = await axios.get(ipfsURI.replace('ipfs:/', 'https://ipfs.io/ipfs'));
            if (response.status === 200) {
              const metadata = response.data;
              const nftData = {
                image: metadata.image.replace('ipfs:/', 'https://ipfs.io/ipfs'),
                name: metadata.name,
                description: metadata.description,
              };
              nftDataArray.push(nftData);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
      }
      setNftDataArray(nftDataArray);
    };

    fetchImageURLs();
  }, [data]);

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-between pt-24">
      <div className="flex flex-col h-48 w-full items-center gap-4 justify-center lg:static lg:h-auto lg:w-auto bg-none">
        {nftDataArray.length > 0 ?
          <div className=' grid grid-cols-2 md:grid-cols-3 gap-4 relative'>
            {nftDataArray.map((nftData, index) => (
              <div key={index} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-600 dark:border-gray-700">
                <img className="p-8 rounded-xl" src={nftData.image} alt={`IPFS Image ${index}`} />
                <div className="px-5 pb-5">

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{nftData.name}</h5>
                      <p className="text-gray-500 dark:text-gray-400">{nftData.description}</p>
                    </div>
                    <Link href={`transfer/${index}`} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Transfer</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          :

          <div className=' flex flex-col'>
            <div className='text-center'>
              <h1 className="mb-4 font-extrabold text-gray-900 text-3xl">You don't have any NFTs yet<br /><span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Do you want to create some?</span></h1>
            </div>
          </div>


        }

        <Link href={'create/'} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create</Link>
      </div>

    </main>
  )
}
