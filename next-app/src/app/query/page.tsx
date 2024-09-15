"use client";
import React from 'react';
import InfiniteGrid from "../../components/InfiniteGrid";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

function convertEnumToRange(enumString: string | undefined): string {
  if (!enumString) return 'N/A';

  // Remove the 'c_' prefix
  if (enumString.startsWith('c_')) {
    enumString = enumString.slice(2);
  }

  // Split the string into two parts
  const parts = enumString.split('_');

  if (parts.length !== 2) {
    return "Invalid format";
  }

  try {
    // Convert each part to an integer, removing leading zeros
    const start = parseInt(parts[0].replace(/^0+/, ''), 10);
    const end = parseInt(parts[1].replace(/^0+/, ''), 10);

    // Format the output
    if (start === end) {
      return start.toString();
    } else {
      return `${start}-${end}`;
    }
  } catch (error) {
    return "Invalid number format";
  }
}

function formatString(str: string | undefined): string {
  if (!str) return 'N/A';
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default function QueryPage() {
  const companies = useQuery(api.tasks.get);

  const renderCompanyTable = () => {
    if (!companies) return null;
    return (
      <div style={{ padding: '20px', overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Description</th>
              <th style={tableHeaderStyle}>Last Funding</th>
              <th style={tableHeaderStyle}>Funding Amount</th>
              <th style={tableHeaderStyle}>Employees</th>
              <th style={tableHeaderStyle}>Location</th>
              <th style={tableHeaderStyle}>Website</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={tableCellStyle}>{company.name}</td>
                <td style={tableCellStyle}>{company.short_description || 'N/A'}</td>
                <td style={tableCellStyle}>{formatString(company.last_funding_type)}</td>
                <td style={tableCellStyle}>
                  {company.last_funding_total?.value_usd
                    ? `$${company.last_funding_total.value_usd.toLocaleString()}`
                    : 'N/A'}
                </td>
                <td style={tableCellStyle}>{convertEnumToRange(company.num_employees_enum)}</td>
                <td style={tableCellStyle}>{company.location_identifiers?.[0]?.value || 'N/A'}</td>
                <td style={tableCellStyle}>
                  {company.website_url ? (
                    <a href={company.website_url} target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  ) : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const tableHeaderStyle = {
    padding: '12px',
    textAlign: 'left' as const,
    borderBottom: '2px solid #ddd',
    fontWeight: 'bold',
  };

  const tableCellStyle = {
    padding: '12px',
    textAlign: 'left' as const,
  };

  return (
    <InfiniteGrid>
      {renderCompanyTable()}
    </InfiniteGrid>
  );
}
