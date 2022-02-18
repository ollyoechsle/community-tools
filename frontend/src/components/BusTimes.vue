<template>
  <div class="ct-component ct-bus-times">
    <div class="bus-times" v-if="data">
      <table class="table">
        <thead>
        <tr>
          <th class="service">No.</th>
          <th>Toward</th>
          <th class="time">Departs</th>
        </tr>
        </thead>
        <tbody>
        <tr :class="departure.className" v-for="(departure, index) in data" :key="index">
          <td class="service">{{ departure.service }}</td>
          <td>{{ departure.destination }}</td>
          <td class="time">
            <time>
              {{ departure.time }}
            </time>
            <div class="inTime">{{ departure.inTime }}</div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-if="error" class="ct-error-message">
      {{ error }}
    </div>
    <div v-if="loading" class="ct-loading">
      Loading...
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import axios, {AxiosResponse} from 'axios'

@Component
export default class BusTimes extends Vue {

  @Prop({required: true})
  public stop?: string;

  private loading = false;
  private data: any = []
  private error? = ""

  public mounted() {
    this.loadData()
  }

  public loadData() {
    this.loading = true;
    this.error = undefined
    this.data = []
    axios.get(`http://localhost:8080/buses?stop=${this.stop}`).then(
        (response: AxiosResponse<any>) => {
          this.data = response.data
          this.loading = false;
        },
        (error) => {
          this.error = "Unable to load news. " + error
          this.loading = false;
        })
  }
}
</script>