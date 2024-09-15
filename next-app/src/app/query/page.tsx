"use client";
import React from 'react';
import InfiniteGrid from "../../components/InfiniteGrid";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

function convertEnumToRange(enumString) {
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

function formatString(str) {
  if (!str) return 'N/A';
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default function ModernCompanyDashboard() {
  const companies = useQuery(api.tasks.get);

  const renderCompanyTable = () => {
    if (!companies) return null;
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Company Dashboard</h1>
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
              </tr>
            </thead>
            <tbody>
              {companies.map((company, index) => (
                <tr key={index}>
                  <td className="company-name">{company.name}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <InfiniteGrid>
        {renderCompanyTable()}
      </InfiniteGrid>
      <style jsx global>{`
        @font-face {
          font-family: 'Geist VF';
          src: url('/path-to-your-fonts/GeistVF.woff2') format('woff2-variations');
          font-weight: 100 900;
          font-stretch: 75% 125%;
        }

        @font-face {
          font-family: 'Geist Mono VF';
          src: url('/path-to-your-fonts/GeistMonoVF.woff2') format('woff2-variations');
          font-weight: 100 900;
        }

        body {
          background-color: #f0f2f5;
        }

        .dashboard {
          font-family: 'Geist VF', sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .dashboard-title {
          font-family: 'Geist VF', sans-serif;
          font-weight: 700;
          font-size: 36px;
          color: #2c3e50;
          margin-bottom: 30px;
          text-align: center;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }

        .table-container {
          overflow-x: auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
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
          color: #34495e;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
        }

        .company-table tr:last-child td {
          border-bottom: none;
        }

        .company-table tr:hover {
          background-color: #f5f5f5;
          transition: background-color 0.3s ease;
        }

        .company-name {
          font-weight: 600;
          color: #3498db;
        }

        .description {
          max-width: 250px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #7f8c8d;
        }

        .badge {
          font-family: 'Geist Mono VF', monospace;
          background-color: #e74c3c;
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .funding-amount {
          font-family: 'Geist Mono VF', monospace;
          font-weight: 600;
          color: #27ae60;
        }

        .website-link {
          color: #3498db;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .website-link:hover {
          color: #2980b9;
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}