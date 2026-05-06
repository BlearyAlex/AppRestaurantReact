

import data from '@/data/mockData.json'
import { SectionCards } from '../components/section-cards'
import { ChartAreaInteractive } from '../components/chart-area-interactive'
import { DataTable } from '@/components/shared/data-table'

function Home() {
    return (
        <>
            <SectionCards />
            <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
        </>
    )
}

export default Home