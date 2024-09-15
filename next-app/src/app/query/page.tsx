"use client";
import React, { useMemo } from 'react';
import InfiniteGrid from "../../components/InfiniteGrid";
import { useState } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

function convertEnumToRange(enumString: string) {
  if (!enumString) return 'N/A';
  if (enumString.startsWith('c_')) {
    enumString = enumString.slice(2);
  }
  const parts = enumString.split('_');
  if (parts.length !== 2) {
    return "Invalid format";
  }
  try {
    const start = parseInt(parts[0].replace(/^0+/, ''), 10);
    const end = parseInt(parts[1].replace(/^0+/, ''), 10);
    return start === end ? start.toString() : `${start}-${end}`;
  } catch (error) {
    return "Invalid number format";
  }
}

function formatString(str: string) {
  if (!str) return 'N/A';
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default function ModernCompanyDashboard() {
  const companies = useQuery(api.tasks.get);
  console.log(companies);
  const [bool_val, setBoolVal] = useState(false);

  React.useEffect(() => {
    if (companies) {
      for (const company of companies) {
        if (company.bool_val) {
          setBoolVal(true);
          break;
        }

      }
    }
  }, [companies]);
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || 'Company Dashboard';

  const [currentPage, setCurrentPage] = useState('query');

  const togglePage = () => {
    setCurrentPage(currentPage === 'query' ? 'playground' : 'query');
  };



  const toggleDotStyle = {
    position: 'absolute' as const,
    top: '3px',
    left: currentPage === 'query' ? '3px' : '33px',
    width: '24px',
    height: '24px',
    backgroundColor: 'rgba(255, 165, 0, 0.6)', // More transparent
    borderRadius: '50%',
    transition: 'left 0.3s',
  };


  const toggleContainerStyle = {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    width: '60px',
    height: '30px',
    backgroundColor: 'rgba(255, 165, 0, 0.1)', // More transparent
    borderRadius: '15px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    zIndex: 1000,
  };


  const memoizedCompanyTable = useMemo(() => {
    if (!companies) return null;
    return (
      <div className="dashboard">
        <h1 className="dashboard-title" style={{ userSelect: 'none' }}>{query}</h1>
        <div className="table-container">
          <table className="company-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Last Funding</th>
                <th>Funding Amount</th>
                <th>Employees</th>
                <th>Location</th>
                <th>Website</th>

                {bool_val && <th>Contact</th>}
                {bool_val && <th>Message</th>}

              </tr>
            </thead>
            <tbody>
              {companies.map((company, index) => (
                <tr key={index}>
                  <td className="company-name">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {company.identifier.permalink && (
                        <img
                          src={`https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_2/${company.identifier.image_id}`}
                          alt={`${company.name} logo`}
                          width={30}
                          height={30}
                          style={{ marginRight: '20px', objectFit: 'contain' }}
                        />
                      )}
                      {company.name}
                    </div>
                  </td>
                  <td className="description">{company.short_description || 'N/A'}</td>
                  <td><span className="badge">{formatString(company.last_funding_type)}</span></td>
                  <td className="funding-amount">
                    {company.last_funding_total?.value_usd
                      ? `$${company.last_funding_total.value_usd.toLocaleString()}`
                      : 'N/A'}
                  </td>
                  <td>{convertEnumToRange(company.num_employees_enum)}</td>
                  <td>{company.location_identifiers?.[0]?.value || 'N/A'}</td>
                  <td>
                    {company.website_url ? (
                      <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="website-link">
                        Visit Site
                      </a>
                    ) : 'N/A'}
                  </td>

                  {bool_val && <td>{company.contact}</td>}
                  {bool_val && <td>{company.message}</td>}

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }, [companies, query]);

  return (
    <>
    <Link href={currentPage === 'query' ? '/playground' : '/query'}>
        <div
          onClick={togglePage}
          style={toggleContainerStyle}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 165, 0, 0.3)'} // More transparent on hover
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 165, 0, 0.1)'}
        >
          <div style={toggleDotStyle} />
        </div>
      </Link>
      <InfiniteGrid>
        {memoizedCompanyTable}
      </InfiniteGrid>
      <style jsx global>{`
        body {
          background-color: #fafafa;
          background-image: radial-gradient(#d3d3d3 1px, transparent 1px);
          background-size: 20px 20px;
          font-family: 'Arial', sans-serif;
        }

        .dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }

        .dashboard-title {
          font-family: 'Playfair Display', serif;
          font-weight: bold;
          font-size: 72px;
          color: #333333;
          margin-bottom: 30px;
          letter-spacing: -2px;
          user-select: none;
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
          word-wrap: break-word;
        }

        .table-container {
          overflow-x: auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          user-select: none;
        }

        .company-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .company-table th, .company-table td {
          padding: 16px 20px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }

        .company-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #333333;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
        }

        .company-table tr:last-child td {
          border-bottom: none;
        }

        .company-table tr {
          transition: background-color 0.3s ease;
        }

        .company-table tr:hover {
          background-color: rgba(0, 0, 0, 0.02) !important;
        }

        .company-name {
          font-weight: 600;
          color: #333333;
        }

        .description {
          max-width: 250px;
          max-height: 100px;
          overflow-y: auto;
          white-space: normal;
          color: #666666;
          padding-right: 10px;
        }

        .description::-webkit-scrollbar {
          width: 6px;
        }

        .description::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .description::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }

        .description::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        .badge {
          background-color: #f0f0f0;
          color: #333333;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .funding-amount {
          font-weight: 600;
          color: #333333;
        }

        .website-link {
          color: #FF7F50;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .website-link:hover {
          color: #FF6347;
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}