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
          font-size: 96px;
          color: #333333;
          margin-bottom: 30px;
          letter-spacing: -2px;
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
          color: #333333;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
        }

        .company-table tr:last-child td {
          border-bottom: none;
        }

        .company-table tr:hover {
          background-color: transparent !important;
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