import { JobCount, Requirement } from './definitions';

export const formatDateToLocal = (
    dateStr: string,
    locale: string = 'en-US',
  ) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
  };

  export const formatMonthToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};


export const formatPeriodDate = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};



  export const generatePagination = (currentPage: number, totalPages: number) => {
    // If the total number of pages is 7 or less,
    // display all pages without any ellipsis.
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
  
    // If the current page is among the first 3 pages,
    // show the first 3, an ellipsis, and the last 2 pages.
    if (currentPage <= 3) {
      return [1, 2, 3, '...', totalPages - 1, totalPages];
    }
  
    // If the current page is among the last 3 pages,
    // show the first 2, an ellipsis, and the last 3 pages.
    if (currentPage >= totalPages - 2) {
      return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
    }
  
    // If the current page is somewhere in the middle,
    // show the first page, an ellipsis, the current page and its neighbors,
    // another ellipsis, and the last page.
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  export const generateYAxis = (JobCount: JobCount[]) => {
    // Calculate what labels we need to display on the y-axis
    // based on highest record and in 1000s
    const yAxisLabels = [];
    const highestRecord = Math.max(...JobCount.map((month) => month.job_count));
    const topLabel = Math.ceil(highestRecord / 1) * 1;
  
    for (let i = topLabel; i >= 0; i -= 100) {
      //yAxisLabels.push(`$${i / 1000}K`);
      yAxisLabels.push(`${i / 1}`);
    }
  
    return { yAxisLabels, topLabel };
  };

  export const generateRequirements = (requirement_id:string[], requirements:Requirement[]) => {
    
    const generetaed_requirements : String[] = [];

    requirements.forEach(requirement => {
      if (requirement_id.includes(requirement.requirement)) {
        generetaed_requirements.push(requirement.requirement);
      }
     
    });
    // Step 2: Add elements from requirement_id that are not in requirements
    requirement_id.forEach(id => {
      const existsInRequirements = requirements.some(requirement => requirement.requirement === id);
      if (!existsInRequirements) {
        generetaed_requirements.push(id);
      }
    });
    return generetaed_requirements;
  }