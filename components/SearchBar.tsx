'use client';

import { scrapeAndStoreProduct } from '@/lib/actions';
import { url } from 'inspector';
import { FormEvent, useState } from 'react';

const isValidAmazonURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if (
      hostname.includes('amazon.com') ||
      hostname.includes('amazon.in') ||
      hostname.includes('amazom.in') ||
      hostname.includes('amazon') ||
      hostname.endsWith('amazom')
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
};

const SearchBar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonURL(searchPrompt);

    if (!isValidLink) {
      return alert('Please enter a valid Amazon product link');
    }

    try {
      setIsLoading(true);
      // Fetch the product details
      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter product link"
        className="searchbar-input"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
      />
      <button
        disabled={searchPrompt === ''}
        type="submit"
        className="searchbar-btn"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};

export default SearchBar;
