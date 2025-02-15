import { Helmet } from 'react-helmet-async';

import { ProgramView } from 'src/sections/programs/view';

// ----------------------------------------------------------------------

export default function ProgramsPage() {
  return (
    <>
      <Helmet>
        <title> Blog | Minimal UI </title>
      </Helmet>

      <ProgramView />
    </>
  );
}
