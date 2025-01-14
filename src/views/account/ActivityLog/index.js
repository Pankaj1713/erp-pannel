import React from 'react'
import { Container, AdaptableCard } from 'components/shared'
import Log from './components/Log'
import LogFilter from './components/LogFilter'
import { injectReducer } from 'store/index'


const ActivityLog = () => {
	return (
		<Container>
			<AdaptableCard>
				<div className="grid lg:grid-cols-5 gap-8">
					<div className="col-span-4">
						<h3 className="mb-6">Activity Log</h3>
						<Log />
					</div>
					<LogFilter />
				</div>
			</AdaptableCard>
		</Container>
	)
}

export default ActivityLog